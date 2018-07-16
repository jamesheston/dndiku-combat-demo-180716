const Dice = require('../../dndiku-lib/lib/Dice')
const charlib = require('../../dndiku-classes/lib/charlib')

class BaseCharacterClass {
  //-------------------
  // Character creation
  //-------------------
  makeChar(player) {
    player.setMeta('pvp', true)
    this.makeCharStats(player) // roll base abilities
    this.makeCharRace(player)
    this.makeCharHp(player)
    this.makeCharMv(player)
    this.makeCharEq(player)
  }
  /**
   * This is likely overwritten in the specific character class
   * file like fighter.js with some base ability floors.
   */  
  makeCharStats(player) {
    player.addAttribute( 'str', charlib.rollBaseAbility() )
    player.addAttribute( 'dex', charlib.rollBaseAbility() )
    player.addAttribute( 'con', charlib.rollBaseAbility() )
    player.addAttribute( 'int', charlib.rollBaseAbility() )
    player.addAttribute( 'wis', charlib.rollBaseAbility() )
    player.addAttribute( 'cha', charlib.rollBaseAbility() )  
  }
  makeCharRace(player) {
    player.setMeta('species', 'human')      

    // height (inches)
    const maleBaseHeight = 60
    // const femaleBaseHeight = 59
    const heightMod = '2d10'
    player.setMeta(  'height', maleBaseHeight + Dice.roll(heightMod)  ) 

    // weight (pounds)
    const maleBaseWeight = 140
    // const femaleBaseWeight = 100
    const weightMod = '6d10'
    player.setMeta(  'weight', maleBaseWeight + Dice.roll(weightMod)  ) 

    // age (years)
    const baseAge = 15
    const ageMod = '1d4'
    const startAge = baseAge + Dice.roll(ageMod)

    player.setMeta( 'startingAge', startAge ) 
    const now = new Date().getTime()
    player.setMeta( 'creationTime', now )
  }
  makeCharHp(player) {
    // roll & add health for first level 
    let hpGained = 0
    // const hitDice = player.getMeta('hitDice')
    const hitDice = this.hitDice // should come either from BaseCharacterClass.js or classes/fighter.js, classes/wizard.js, etc.
    const rollResult = Dice.roll(hitDice)
    const conHpModifier = this.getConHpMod( player )
    hpGained+= rollResult
    hpGained+= conHpModifier
    player.setAttributeBase('health', hpGained ) // started off player with just 1 hit point before rolling hp 
  }
  makeCharMv(player) {
    let maxMoves = 100
    player.addAttribute('mv', maxMoves)
  }
  makeCharEq(player) {
    this.makeCharGp(player)
    // add newbie kit here
    this.makeNewbieKit(player)
  }
  makeCharGp(player) {
    const currency = 'gold'
    const classGpDice = player.getMeta('goldDice')
    const startingGold = Dice.roll(classGpDice)  * 10

    const currencyKey = 'currencies.' + currency
    if (!player.getMeta('currencies')) {
      player.setMeta('currencies', {})
    }
    player.setMeta(currencyKey, (player.getMeta(currencyKey) || 0) + startingGold)  
  }
  makeNewbieKit(player) {

  }

  //---------------------------------
  // Character leveling & maintenance
  //---------------------------------
  /**
   * Return total experience points required for a specific level.
   */
  getTotalXpForLevel(player, level) {
    return this.xpTable[level]
  }
  /**
   * Return remaining experience points required for player to gain
   * their next level.
   */
  getTnl(player) {
    const requiredXp = this.getTotalXpForLevel( player, player.level + 1 )
    const tnl = requiredXp - player.experience
    return tnl
  }
  get abilityList() {
    return Object.entries(this.abilityTable).reduce((acc, [ , abilities ]) => {
      return acc.concat(abilities.skills || []).concat(abilities.spells || []);
    }, []);
  }  
  /**
   * At what levels do you get which abilities
   */
  get abilityTable() {
    return {
      // 1: { skills: ['bash', 'protect', 'rescue', 'first aid'] },      
    }  
  }
  /**
   * Get a flattened list of all the abilities available to a given player
   * @param {Player} player
   * @return {Array<string>} Array of ability ids
   */
  getAbilitiesForPlayer(player) {
    let totalAbilities = [];
    Object.entries(this.abilityTable).forEach(([level, abilities]) => {
      if (level > player.level) {
        return;
      }
      totalAbilities = totalAbilities.concat(abilities.skills || []).concat(abilities.spells || []);
    });
    return totalAbilities;
  }  
  /**
   * Check to see if this class has a given ability
   * @param {string} id
   * @return {boolean}
   */
  hasAbility(id) {
    return this.abilityList.includes(id);
  }

  /**
   * Check if a player can use a given ability
   * @param {Player} player
   * @param {string} abilityId
   * @return {boolean}
   */
  canUseAbility(player, abilityId) {
    return this.getAbilitiesForPlayer(player).includes(abilityId);
  }  
  gainLevelHp(player) {
    // update health with hitpoints gained for this level
    let newMaxHp = 0
    const oldMaxHp = player.getBaseAttribute('health')
    let hpGained = 0
    const hitDice = player.metadata.hitDice
    const rollResult = Dice.roll(hitDice)
    const conHpModifier = this.getConHpMod( player.getAttribute('con') )
    hpGained+= rollResult
    hpGained+= conHpModifier
    newMaxHp = oldMaxHp + hpGained
    player.setAttributeBase('health', newMaxHp ) // started off player with just 1 hit point before rolling hp 
  }


  //-------
  // Combat
  //-------

  /**
   * This method should only be used for players or, eventually, mobiles
   * that use player classes. Most mobiles are of type MONSTER and just
   * pull in a flat set of dnd monster manual-type stats, wherein AC is
   * just a single number.
   */
  getAc(player) {
    let ac = 10

    const baseAc = 10 // starting AC value without eq or ability mods is 10
    let armorAcMod = 0
    let shieldAcMod = 0
    let helmetAcMod = 0
    let dexAcMod = 0

    const armor = player.equipment.get('body')
    if( armor && armor.metadata.ac ) {
      armorAcMod+= armor.metadata.ac
    }  

    const shield = player.equipment.get('shield')
    if( shield && shield.metadata.ac ) {
      shieldAcMod = shield.metadata.ac
    }

    // let helmet = player.equipment.get('head')
    // if( helmet && helmet.metadata.ac ) {
    //   helmetAcMod = helmet.metadata.ac
    // }  

    // dexAcMod is already inverted, so it must be added, not subtracted
    dexAcMod = this.getDexAcMod(  player  )

    
    ac = 10 - armorAcMod - shieldAcMod + dexAcMod 
    return ac
  }

  getAutoAttacks(player) {
    // For now, we only have to deal with 1 autoAttack object for 
    // players because there is no multi-wield support yet. But
    // we'll keep the "attacks" as an array so it's easy to add support
    // for multiple attacks later.
    const attacks = []    

    // grab player's wielded weapon stats
    let weapon = player.equipment.get('wield')
    // grab fallback unarmed "weapon" stats
    if(! weapon ) {
      weapon = this.getUnarmedWeapon()
    }

    const attack = {
      // eg 'a steel longsword'
      weaponName: weapon.name, 
      // eg '1d6+1'. sum after all mods, including weapon.magicalMod   
      // remember, weapon needs to be specified here so we can easily
      // add multi-wield later. That means Character.getDamageDiceSum(w) 
      // needs to have its parameter for "weapon" to be optional.
      // If a weapon object wasn't passed, Character.getDamageDiceSum()
      // will default to 1st wielded weapon.
      damageDiceSum: this.getDamageDiceSum(player, weapon), 
      // eg 20. sum after all mods, including weapon.magicalMod      
      thac0Sum: this.getThac0Sum(player, weapon), 
      magicalModifier: parseInt( weapon.metadata.magicalModifier || 0 ),
      // eg 1. based on character class/level
      attacksPerRound: this.getAttacksPerRound(player), 
      // attack verb, eg 'slash'
      verb: weapon.metadata.verb,
    }
    attacks.push(attack)

    return attacks
  }

  getThac0(player) {
    const thac0 = this.getThac0Sum(player)
    return thac0
  }

  getThac0Sum(player) {
    let thac0Sum

    // grab player's wielded weapon stats
    let weapon = player.equipment.get('wield')
    // grab fallback unarmed "weapon" stats
    if(! weapon ) {
      weapon = this.getUnarmedWeapon()
    }

    const classLevelThac0 = this.getClassLevelThac0( player )    
    // right now, only melee attacks exist, so no dex modifiers to hit
    const abilityToHitMod = this.getStrToHitMod( player )
    const magicalWeaponMod = parseInt(weapon.metadata.magicalModifier || 0)
    const weaponProfToHitMod = this.getWeaponProfToHitMod( player )
    thac0Sum = classLevelThac0 - abilityToHitMod - magicalWeaponMod - weaponProfToHitMod

    return thac0Sum    
  }

  getClassLevelThac0(player) {
    return this.thac0Table[ player.level ]
  }
  /**
   * Most classes aside from warriors just get a single melee attack
   * every round with whatever weapon they're wielding.
   */
  getAttacksPerRound(player) {
    return 1
  }

  getDamageDiceSum(player) {
    let damageDiceSum = ''

    // grab player's wielded weapon stats
    let weapon = player.equipment.get('wield')
    // grab fallback unarmed "weapon" stats
    if(! weapon ) {
      weapon = this.getUnarmedWeapon()
    }

    const weaponBaseDamage = weapon.metadata.damageDice
    const weaponMagicalMod = parseInt(weapon.metadata.magicalModifier || 0)
    const abilityDamageMod = this.getStrDamageMod(player)  // no ranged attacks for now, so str is only modifier possible atm
    const weaponProfDamageMod = this.getWeaponProfDamageMod(player)
    // build final string
    damageDiceSum = weaponBaseDamage + '+' + (weaponMagicalMod + abilityDamageMod + weaponProfDamageMod)
    return damageDiceSum    
  }
  /**
   * Returns proficiency (int) of player character's currently
   * wielded weapon (or default unarmed proficiency)
   */  
  getWeaponProf(player) {
    return 1
  }
  getWeaponProfDamageMod(player) {
    /*
    In complete AD&D rules, if you use a weapon have spent 0 proficiency points
    on (not proficient), you get a -2 penalty to hit. If you have 1 prof point in that 
    weapon type, you get no bonus or penalty. If you're a warrior, you can spend 2
    points to *focus* in a weapon, and get +1 to-hit rolls, and +2 to damage rolls

    For now, in our combat system, the only way weapn proficiencies and specialization
    are implemented is that warriors get +1 to-hit rolls and +2 to damage rolls when 
    wielding a weapon/not unarmed (that
    is, I assume warriors are specialists in whatever weapon they are wielding. And I
    assume all other classes are at least proficient in whatever weapon they are 
    wielding).
    */ 
    const proficiencyLevel = this.getWeaponProf(player)
    const profDamageTable = {
      0: 0,
      1: 0,
      2: 2,
    }
    return profDamageTable[  proficiencyLevel  ]    
  }
  getWeaponProfToHitMod(player) {
    /*
    In complete AD&D rules, if you use a weapon have spent 0 proficiency points
    on (not proficient), you get a -2 penalty to hit. If you have 1 prof point in that 
    weapon type, you get no bonus or penalty. If you're a warrior, you can spend 2
    points to *focus* in a weapon, and get +1 to-hit rolls, and +2 to damage rolls

    For now, in our combat system, the only way weapn proficiencies and specialization
    are implemented is that warriors get +1 to-hit rolls and +2 to damage rolls when 
    wielding a weapon/not unarmed (that
    is, I assume warriors are specialists in whatever weapon they are wielding. And I
    assume all other classes are at least proficient in whatever weapon they are 
    wielding).
    */
    const proficiencyLevel = this.getWeaponProf(player)
    const profToHitTable = {
      0: 0,
      1: 0,
      2: 1,
    } 
    return profToHitTable[proficiencyLevel]       
  }
  /**
   * Returns autoattack damage dice for wielded "weapon" when character
   * isn't wielding any weapons. Dukes up motherfuckers!
   */  
  getUnarmedWeapon() {
    return {
      name: 'unarmed',
      metadata: {
        damageDice: '1d1',
        magicalModifier: 0,
        verb: 'punch',
        range: 0, 
      }          
    }
  }
  //------------------------
  // Ability Modifier Tables
  //------------------------
  get strToHitTable() {
    return {
      1: -5,
      2: -3,
      3: -3,
      4: -2,
      5: -2,
      6: -1,
      7: -1,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 1,
      18: 1      
    }
  }
  getStrToHitMod(player) {
    return this.strToHitTable[ player.getAttribute('str') ]
  }
  get strToDamageTable() {
    return {
      1: -4,
      2: -2,
      3: -1,
      4: -1,
      5: -1,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 1,
      17: 1,
      18: 2      
    }
  }
  getStrDamageMod(player) {
    return this.strToDamageTable[ player.getAttribute('str') ]
  }
  get dexAcTable() {
    return {
      1: 5,
      2: 5,
      3: 4,
      4: 3,
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: -1,
      16: -2,
      17: -3,
      18: -4        
    }
  }
  getDexAcMod(player) {
    return this.dexAcTable[ player.getAttribute('dex') ]
  }
  get conHpTable() {
    return {
      1: -3,
      2: -2,
      3: -2,
      4: -1,
      5: -1,
      6: -1,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 1,
      16: 2,
      17: 2,
      18: 2,       
    }
  }
  getConHpMod(player) {
    return this.conHpTable[ player.getAttribute('con') ]
  }


}

module.exports = BaseCharacterClass
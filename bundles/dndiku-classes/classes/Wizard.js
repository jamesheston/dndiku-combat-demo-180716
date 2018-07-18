const Dice = require('../../dndiku-lib/lib/Dice')
const BasePlayerClass = require('../../dndiku-classes/lib/BasePlayerClass')
const charlib = require('../../dndiku-classes/lib/charlib')


class Wizard extends BasePlayerClass {
  constructor(props) {
    super(props)
  }
  get id() {
    return 'wizard'
  }
  get name() {
    return 'Wizard'
  }
  get description() {
    return 'Wizards are the weakest of all classes in physical combat. They must seek arcane knowledge to survive.'
  }
 /**
   * Used for hit point rolls during character creation and on level gains.
   */
  get hitDice() {
    return '1d4'
  }
  /**
   * Roll this to determine starting gold amount for new characters of this
   * class.
   */
  get goldDice() {
    return '1d4+1' // * 10
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
   * Experience point requirements for levels 1-20
   */
  get xpTable() {
    return {
      1: 0,
      2: 2500,
      3: 5000,
      4: 10000,
      5: 20000,
      6: 40000,
      7: 60000,
      8: 90000,
      9: 135000,
      10: 250000,
      11: 375000,
      12: 750000,
      13: 1125000,
      14: 1500000,
      15: 1875000,
      16: 2250000,
      17: 2625000,
      18: 3000000,
      19: 3375000,
      20: 3750000,        
    }
  }
  /**
   * Base THAC0 for this class at each level
   */
  get thac0Table() {
    return {
      1: 20, 
      2: 20, 
      3: 20, 
      4: 19, 
      5: 19, 
      6: 19, 
      7: 18, 
      8: 18, 
      9: 18, 
      10: 17, 
      11: 17, 
      12: 17, 
      13: 16, 
      14: 16, 
      15: 16, 
      16: 15, 
      17: 15, 
      18: 15, 
      19: 14, 
      20: 14         
    }
  }
  /**
   * For now, just assume wizards are *not* proficient with
   * any weapon they may be wielding.
   */
  getWeaponProf(player) {
    return 0
  }
  /**
   * Wizards have a floor on int of 9.
   */
  makeCharStats( player ) {
    player.addAttribute( 'str', charlib.rollBaseAbility({floor: 9}) )
    player.addAttribute( 'dex', charlib.rollBaseAbility({floor: 9}) )
    player.addAttribute( 'con', charlib.rollBaseAbility({floor: 9}) )
    player.addAttribute( 'int', charlib.rollBaseAbility() )
    player.addAttribute( 'wis', charlib.rollBaseAbility() )
    player.addAttribute( 'cha', charlib.rollBaseAbility() )  
  }
  /**
   * This runs when player enters the game, not when character is created.
   * Vestigal ranvier method I don't much like the name of.
   */
  setupPlayer(player) {

  }

}

module.exports = Wizard
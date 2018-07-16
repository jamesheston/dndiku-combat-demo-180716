const Dice = require('../../dndiku-lib/lib/Dice')
const BaseCharacterClass = require('../../dndiku-classes/lib/BaseCharacterClass')
const charlib = require('../../dndiku-classes/lib/charlib')

class Fighter extends BaseCharacterClass {
  constructor(props) {
    super(props)
  }
  get id() {
    return 'fighter'
  }
  get name() {
    return 'Fighter'
  }
  get description() {
    return 'Fighters are experts in weapons, armors, and close combat.'
  }
 /**
   * Used for hit point rolls during character creation and on level gains.
   */
  get hitDice() {
    return '1d10'
  }
  /**
   * Roll this to determine starting gold amount for new characters of this
   * class.
   */
  get goldDice() {
    return '5d4'
  }  
  /**
   * Experience point requirements for levels 1-20
   */
  get xpTable() {
    return {
      1: 0,
      2: 2000,
      3: 4000,
      4: 8000,
      5: 16000,
      6: 32000,
      7: 64000,
      8: 125000,
      9: 250000,
      10: 500000,
      11: 750000,
      12: 1000000,
      13: 1250000,
      14: 1500000,
      15: 1750000,
      16: 2000000,
      17: 2250000,
      18: 2500000,
      19: 2750000,
      20: 3000000        
    }
  }
  /**
   * Base THAC0 for this class at each level
   */
  get thac0Table() {
    return {
      1: 20, 
      2: 19, 
      3: 18, 
      4: 17, 
      5: 16, 
      6: 15, 
      7: 14, 
      8: 13, 
      9: 12, 
      10: 11, 
      11: 10, 
      12: 9, 
      13: 8, 
      14: 7, 
      15: 6, 
      16: 5, 
      17: 4, 
      18: 3, 
      19: 2, 
      20: 1       
    }
  }
  /**
   * Warriors have a floor on all physical stats of 9.
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
   * Warriors get a number of extra attacks per round depending on 
   * their level.
   */
  getAttacksPerRound(player) {
    // For the time being, we assume fighters are always specialists
    // with a given weapon. (2/2 proficiency points spent in weapon)
    const weaponProficiency = 2
    const characterLevel = player.level
    const warriorAttacksPerRound = {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 3/2,
      8: 3/2,
      9: 3/2,
      10: 3/2,
      11: 3/2,
      12: 3/2,
      13: 2,
      14: 2,
      15: 2,
      16: 2,
      17: 2,
      18: 2,
      19: 2,
      20: 2,
    }
    const specialistAttacksPerRound = {
      1: 3/2,
      2: 3/2,
      3: 3/2,
      4: 3/2,
      5: 3/2,
      6: 3/2,
      7: 2,
      8: 2,
      9: 2,
      10: 2,
      11: 2,
      12: 2,
      13: 5/2,
      14: 5/2,
      15: 5/2,
      16: 5/2,
      17: 5/2,
      18: 5/2,
      19: 5/2,
      20: 5/2,
    }

    if( weaponProficiency === 2 ) {
      return specialistAttacksPerRound[characterLevel]
    } else {
      return warriorAttacksPerRound[characterLevel]
    } 
  }

  /**
   * This runs when player enters the game, not when character is created.
   * Vestigal ranvier method I don't much like the name of.
   */
  setupPlayer(player) {

  }
}

module.exports = Fighter
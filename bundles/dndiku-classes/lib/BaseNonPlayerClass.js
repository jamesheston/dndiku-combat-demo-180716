const Dice = require('../../dndiku-lib/lib/Dice')
const charlib = require('../../dndiku-classes/lib/charlib')

class BaseNonPlayerClass {
  /**
   * Transform attacks data from npcs.yml to the format required by Combat system
   */
  static getAutoAttacks(npc) {
    let attacks = []
    let rawAttacks = (  npc.getMeta('autoAttacks')  ) ? npc.getMeta('autoAttacks') : this.getFallbackAttacks(npc) // maybe add default attack for false based on NPC level

    for (var i = 0; i < rawAttacks.length; i++) {
      const data = rawAttacks[i]
      const attack = { 
        weaponName: '', // try to ignore this for now
        damageDiceSum: data.damageDice, // no ability modifiers for npcs
        thac0Sum: ( npc.getMeta('thac0') ) ? npc.getMeta('thac0') : 20, // attack thac0 comes directly from npc thac0, or fall back to 20
        magicalModifier: data.magicalModifier,
        attacksPerRound: data.attacksPerRound,
        verb: data.verb,

      }
      attacks.push(attack)
    }

    return attacks
  }

  /**
   * Provide some fallback attack data for NPCs that are missing any required data
   */
  static getFallbackAttacks(npc) {
    return [{ // array of 1 attack
      damageDice: '1d1',
      magicalModifier: 0,
      attacksPerRound: 1,
      verb: 'attack',
      // range: 0, 
    }]
  }  
}

module.exports = BaseNonPlayerClass
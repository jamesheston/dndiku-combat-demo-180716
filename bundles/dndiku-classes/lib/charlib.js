function charlib() {}
module.exports = charlib

// add imports here
const Dice = require('../../dndiku-lib/lib/Dice')

charlib.rollBaseAbility = function(opts) {
  let total = 0
  total = Dice.roll('3d6', opts)
  return total
}

charlib.getUnarmedWeaponPC = function() {
  return {
    name: 'unarmed',
    metadata: {
      damageDice: '1d1',
      magicalModifier: 0,
      verb: 'hit',
      range: 0, 
    }          
  }  
}
charlib.getUnarmedWeaponNPC = function() {
  return {
    name: 'unarmed',
    metadata: {
      damageDice: '1d1',
      magicalModifier: 0,
      verb: 'attack',
      range: 0, 
    }          
  }  
}

charlib.getFallbackNpcAutoAttacks = function(character) {
  let attacks = []

  const thac0 = 20 // maybe add code to attempt to pull npc thac0 but prolly no point  
  const weapon = charlib.getUnarmedWeaponNPC()

  const attack = { 
    attacksPerRound: 1,
    weaponName: weapon.name,
    damageDiceSum: weapon.metadata.damageDice,
    thac0Sum: thac0,
    magicalModifier: weapon.metadata.magicalModifier, 
    verb: weapon.metadata.verb,
    range: weapon.metadata. range
  }

  attacks.push(attack)

  return attacks
}


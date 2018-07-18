function charlib() {}
module.exports = charlib

// add imports here
const Dice = require('../../dndiku-lib/lib/Dice')

charlib.rollBaseAbility = function(opts) {
  let total = 0
  total = Dice.roll('3d6', opts)
  return total
}


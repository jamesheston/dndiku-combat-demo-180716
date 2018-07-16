class Dice {
  /**
   * @param {string} specifier is just a string that specifies a "roll"
   * to simulate, or how you want to generate a random number.
   * Examples would be "1d6" or "2d6" or "1" or "3-5". You
   * can even pass in a flat number like 10 b/c specifier is converted 
   * to a string before before checks.
   * @param {object} opts can attach options like `floor: 4` or 
   * `ceiling: 16` to restrict output range of random number generated
   */
  static roll(specifier, opts = null) {
    let total = 0
    const s = String(specifier).trim()


    // specifier format 1: classic dice roll shorthand, eg: "1d6", "2d4+1"
    const rgx1 = /^([0-9]+)d([0-9]+)(\+[0-9]+)?$/

    // specifier format 2: range, eg "1-6", "2-8"
    const rgx2 = /^([0-9]+)\-([0-9]+)$/

    // specifier format 3: flat number eg "1" or "13"
    const rgx3 = /^([0-9])$/

    if( rgx1.test(s) ) {
      const numberOfDice = parseInt(  s.match(rgx1)[1]  )
      const numberOfSides = parseInt(  s.match(rgx1)[2]  )

      let summand = s.match(rgx1)[3] // the "1" in "2d4+1" 
      total = this.rollDice(numberOfDice, numberOfSides, summand)

    } else if ( rgx2.test(s) ) {
      const min = parseInt(  s.match(rgx2)[1]  )
      const max = parseInt(  s.match(rgx2)[2]  )
      total = this.genRange(min, max)      

    } else if ( rgx3.test(s) ) {
      total = parseInt(s)

    } else {
      // do nothing, just fail silently by passing 0 back
      // if formatting is bad
    }


    // apply floor or ceiling if they were specified in opts
    if( opts && opts.floor && total < opts.floor ) {
      total = opts.floor
    } else if ( opts && opts.ceiling && total > opts.ceiling ) {
      total = opts.ceiling
    }

    return total
  }

  static rollDice(numberOfDice, numberOfSides, summand = undefined) {
    let total = 0
    if( summand ) { // remember this still has a '+' stuck on the front
      summand = parseInt(  summand.replace('+', '')  )
    } else {
      summand = 0
    }

    // simulate each dice roll
    for( let i = 0; i < numberOfDice; i++ ) {
      var result = Math.floor(  Math.random()*numberOfSides  ) + 1
      total+= result
    }      
    total+= summand

    return total
  }

  static genRange(min, max) {
    return min + Math.floor(  Math.random()*max  )
  }
} 

module.exports = Dice
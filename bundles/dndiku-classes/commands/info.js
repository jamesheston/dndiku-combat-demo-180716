const Combat           = require('../../dndiku-combat/lib/Combat')
const charlib          = require('../../dndiku-classes/lib/charlib')

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast')

  return {
    aliases: [ 'stat' ],

    command : (state) => (args, p) => {
      //-------------
      // General Info
      //-------------
      const speciesStr = p.metadata.species.slice(0, 1).toUpperCase() + p.metadata.species.slice(1) // capitalize first letter
      const tnl = p.playerClass.getTnl(p)
      const className = p.playerClass.name.slice(0, 1).toUpperCase() + p.getMeta('class').slice(1) // capitalize first letter
      const gp = ( p.getMeta('currencies.gold') ) ? p.getMeta('currencies.gold') : 0
      //------------------
      // Misc Combat Stats
      //------------------
      const hpNow = p.getAttribute('health')
      const hpMax = p.getMaxAttribute('health')
      const ac = p.playerClass.getAc(p)
      //-----------------
      // Autoattack Stats
      //-----------------
      const autoAttacks = p.playerClass.getAutoAttacks(p)
      // these attack vars will need to be turned into an entry in an "autoAttacks" array 
      // once I need to support multi-wielding/multiple player autoAttacks      
      const weaponName = autoAttacks[0].weaponName
      const thac0 = autoAttacks[0].thac0Sum
      const damageDiceSum = autoAttacks[0].damageDiceSum
      const attacksPerRound = autoAttacks[0].attacksPerRound
      const damageType = autoAttacks[0].verb // this is the verb used in combat auto attack messages
      const magicalModifier = autoAttacks[0].magicalModifier
      const weaponProficiency = p.playerClass.getWeaponProf(p)
      // const age = p.playerClass.getAge(p)
      const age = 17
      // const loadWeight = p.playerClass.getLoadWeight(p)
      const loadWeight = 0

let output = `
Name: <green>${p.name}</green>    Race: <green>${(speciesStr)}</green>    Home: <green>Village</green>    Age: <green>${age}</green>
Class: <green>${className}</green>    Level: <green>${p.level}</green>    Total XP: <green>${p.experience}</green>    TNL: <green>${tnl}</green>
Gold: <green>${gp}</green>    Load: <green>${loadWeight} lbs</green>    Encumbered: <green>no</green>

Str: <green>${p.getAttribute('str')}</green>, Dex: <green>${p.getAttribute('dex')}</green>, Con: <green>${p.getAttribute('con')}</green>, Int: <green>${p.getAttribute('int')}</green>, Wis: <green>${p.getAttribute('wis')}</green>, Cha: <green>${p.getAttribute('cha')}</green>

HP: <green>${hpNow}</green>/<green>${hpMax}</green>,  AC: <green>${ac}</green>

[<green>${weaponName}</green>] THAC0: <green>${thac0}</green>,  Damage: <green>${damageDiceSum}</green>,  Attacks/Round: <green>${attacksPerRound}</green>
Damage Type: (<green>${damageType.slice(0,1).toUpperCase()}</green>)${damageType.slice(1)},  Magical Modifier: <green>${magicalModifier}</green>,  Proficiency: <green>${weaponProficiency}</green>

`
      Broadcast.sayAt(p, output)
    }
  }
}
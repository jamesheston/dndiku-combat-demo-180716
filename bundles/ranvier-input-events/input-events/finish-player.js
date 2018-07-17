/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  const Player = require(srcPath + 'Player');
  const Fighter = require('../../dndiku-classes/classes/Fighter')
  const Wizard = require('../../dndiku-classes/classes/Wizard')

  return {
    event: state => (socket, args) => {
      let player = new Player({
        name: args.name,
        account: args.account,
        // TIP:DefaultAttributes: This is where you can change the default attributes for players
        attributes: {
          health: 1, // never pass 0 here, player will die on a loop
        }
      });

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);

      let pClass
      // add character creation call on `player` obj here
      if( args.playerClass === 'Fighter' ) {
        pClass = new Fighter()
      } else if ( args.playerClass === 'Wizard' ) {
        pClass = new Wizard()
      }
      pClass.makeChar(player)

      const room = state.RoomManager.startingRoom;
      player.room = room;
      player.save();

      // reload from manager so events are set
      player = state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    }
  };
};

'use strict';

/**
 * Player class selection event
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const EventUtil = require(srcPath + 'EventUtil');
  const Config     = require(srcPath + 'Config');

  return {
    event: state => (socket, args) => {
      const say = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      /*
      Player selection menu:
      * Can select existing player
      * Can create new (if less than 3 living chars)
      */
     say('  Pick your class');
      say(' --------------------------');
      const classes = [...state.ClassManager].map(([id, instance]) => {
        return [id, instance];
      });
      // for (const [ id, config ] of classes) {
      for (const [ id, instance ] of classes) {

        say(`[<bold>${id}</bold>] - <bold>${instance.name}</bold>`);
        say(Broadcast.wrap(`      ${instance.description}\r\n`, 80));
      }
      write('> ');

      socket.once('data', choice => {
        choice = choice.toString().trim();
        choice = classes.find(([id, instance]) => {
          return id.includes(choice) || instance.name.toLowerCase().includes(choice);
        });

        if (!choice) {
          return socket.emit('choose-class', socket, args);
        }

        args.playerClass = choice[0];
        socket.emit('finish-player', socket, args);
      });
    }
  };
};

const Cli = require('./cli')
const Game = require('./libs/game');

let options = Cli.parse();
if (!options) process.exit(1);

const defaultOptions = {
  'maze-height': 15,
  'maze-player-name': 'Applejack',
  'maze-width': 15,
  difficulty: 5,
};

options = { ...defaultOptions, ...options }
const game = new Game(options);

game
  .initialize()
  .then(() => {
    game.play(game);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

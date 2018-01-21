const Cli = require('./cli');
const Game = require('./libs/game');
const Ansi = require('./utils/ansi');

let options = Cli.parse();
if (!options) process.exit(1);

const defaultOptions = {
  difficulty: 5,
  'maze-height': 15,
  'maze-player-name': 'Applejack',
  'maze-width': 15,
};

options = { ...defaultOptions, ...options };
const game = new Game(options);

game
  .initialize()
  .then(() => {
    game.play(game);
  })
  .catch(e => {
    Ansi.renderInfo(`ERROR: ${e.message}`);
    process.exit(1);
  });

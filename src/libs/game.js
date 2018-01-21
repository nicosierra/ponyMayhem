const Maze = require('./maze');
const Ansi = require('./../utils/ansi');
const setDelay = require('./../utils/setDelay');

const GAME_STATES = { ACTIVE: 'active', WON: 'won', OVER: 'over' };

class Game {
  constructor(options) {
    this.maze = new Maze(options);
    this.output = null;
    this.state = null;
    this.messages = [];
    this.ansi = new Ansi()
  }

  async initialize() {
    const result = await this.maze.initialize();
    this._processResult(result);
    this.output = await this.maze.printMaze();
    this.renderGame(this.output);
  }

  play() {
    if (!this.isActive) {
      return;
    }
    return this.makeMove().then(setDelay.bind(10)).then(this.play.bind(this));
  }

  renderGame() {
    this.ansi.render(this.output);
    this.ansi.renderInfo(this.state, this.messages.pop());
  }

  async makeMove() {
    const result = await this.maze.makeNextMove();
    this._processResult(result);

    this.output = await this.maze.printMaze();
    this.renderGame(this.output);
  }

  _processResult(result) {
    this.state = result.state.toLocaleLowerCase();
    this.messages.push(result['state-result']);
  }

  isActive() {
    return this.state === GAME_STATES.ACTIVE;
  }
}

module.exports = Game;

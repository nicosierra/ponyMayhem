const Maze = require('./maze');
const Ansi = require('./../utils/ansi');
const config = require('config');
const setDelay = require('./../utils/setDelay');

const GAME_STATES = { ACTIVE: 'active', OVER: 'over', WON: 'won' };

class Game {
  constructor(options) {
    this.maze = new Maze(options);
    this.output = null;
    this.state = null;
    this.messages = [];
  }

  async initialize() {
    const result = await this.maze.initialize();
    this._processResult(result);
    this.output = await this.maze.printMaze();
    this._renderGame(this.output);
  }

  async play() {
    await this._renderGame(this.output);
    if (!this._isActive()) {
      return;
    }
    return this._makeMove()
      .then(setDelay.bind(config.get('delay')))
      .then(this.play.bind(this));
  }

  async _renderGame() {
    this.output = await this.maze.printMaze();
    Ansi.render(this.output);
    Ansi.renderInfo(`Game ${this.state}, ${this.messages.pop()}`);
    Ansi.renderInfo(
      `MazeSize ${this.maze
        .getSize()
        .join(' x ')}, Difficulty: ${this.maze.getDifficulty()}, Exit: CTRL + C,`,
    );
  }

  async _makeMove() {
    const result = await this.maze.makeNextMove();
    this._processResult(result);
  }

  _processResult(result) {
    this.state = result.state.toLocaleLowerCase();
    this.messages.push(result['state-result']);
  }

  _isActive() {
    return this.state === GAME_STATES.ACTIVE;
  }
}

module.exports = Game;

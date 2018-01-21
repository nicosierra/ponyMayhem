const ansi = require('ansi');
const cursor = ansi(process.stdout);
const stdo = process.stdout;
const cols = stdo.columns;
const rows = stdo.rows;

class Ansi {
  constructor() {
    this.currentY = 0;
  }

  render(output) {
    cursor
      .goto(0, 0)
      .eraseData()
      .write(output);
  }

  renderInfo(state, message) {
    cursor
      .nextLine()
      .eraseLine()
      .write(`Game state: ${state}`)
      .forward(10)
      .write(message);
  }
}

module.exports = Ansi;

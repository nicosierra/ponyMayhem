const ansi = require('ansi');
const cursor = ansi(process.stdout);

module.exports = {
  render: output => {
    cursor
      .goto(0, 0)
      .eraseData()
      .write(output);
  },
  renderInfo: info => {
    cursor
      .nextLine()
      .eraseLine()
      .write(info);
  },
};

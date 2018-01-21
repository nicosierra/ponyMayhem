const Game = require('./services/game');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [
  {
    description: 'Display this usage guide.',
    name: 'help',
    type: Boolean,
  },
  {
    alias: 'n',
    description: `The name of the player to help the pony (Default: 'Applejack')`,
    name: 'maze-player-name',
    type: String,
  },
  {
    alias: 'w',
    description: 'Width of the maze (Default: 15)',
    name: 'maze-width',
    type: Number,
  },
  {
    alias: 'h',
    description: 'Height of the maze (Default: 15)',
    name: 'maze-height',
    type: Number,
  },
  {
    alias: 'd',
    description: 'Difficulty of the game (Default: 5)',
    name: 'difficulty',
    type: Number,
  },
];

let error = false;

module.exports = {
  parse: parse,
};

/**
 * Parses the arguments of the cli call.
 * @returns {any|false} returns options or false if the help was invoked
 */
function parse() {
  try {
    options = commandLineArgs(optionDefinitions);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
    error = true;
  }

  if (error || options.help) {
    const usage = commandLineUsage([
      {
        header: 'Save the Pony!',
        content:
          'Program that helps Ponies to find their shortest path to Ponyville, ' +
          'by using the Pony Challenge Api from Trustpilot.',
      },
      {
        header: 'Options',
        optionList: optionDefinitions,
      },
    ]);
    console.log(usage);
    return false;
  } else {
    return options;
  }
}

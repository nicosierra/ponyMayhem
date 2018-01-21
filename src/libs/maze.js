const PonyApi = require('./ponyApi.service');

/** @typedef {children: string[], path: number[], visited: boolean} Node */

class Maze {
  constructor(options) {
    this.mazeId = null;
    this.state = null;
    this.options = options;
  }

  async initialize() {
    this.mazeId = await PonyApi.createMaze(this.options);
    this.state = await PonyApi.getMazeState(this.mazeId);
    return this.state['game-state'];
  }

  printMaze() {
    return PonyApi.printMaze(this.mazeId);
  }

  async makeNextMove() {
    const direction = this._calculateNextMove();
    await PonyApi.movePony(this.mazeId, direction);
    this.state = await PonyApi.getMazeState(this.mazeId);
    return this.state['game-state'];
  }

  /**
   * Calculates the next move and returns the direction in which to move the pony
   * @returns string
   */
  _calculateNextMove() {
    const ponyIndex = this.state.pony[0];
    const goalIndex = this.state['end-point'][0]
    const domokunIndex = this.state.domokun[0];
    const nodes = this._buildAdjacencyListNodes();

    const pathToGoal = this._traverseDfs(nodes, ponyIndex, goalIndex, domokunIndex, [], []);

    // find Next Step
    let nextStep;
    if (!pathToGoal) {
      const indices = nodes[ponyIndex].children.length;
      const index = Math.floor(Math.random() * indices)
      nextStep = nodes[ponyIndex].children[index];
    }
    else {
      nextStep = pathToGoal[1];
    }

    return this._moveToText(ponyIndex, nextStep);
  }

  /**
   * Returns a valid direction string for a desired movement
   * @returns string
   * @param {*} currentIndex Position of the pony
   * @param {*} nextIndex Next position of the pony
   */
  _moveToText(currentIndex, nextIndex) {
    const [width] = this.state.size;
    if (currentIndex - nextIndex === 1) {
      return 'west';
    }
    if (nextIndex - currentIndex === 1) {
      return 'east';
    }
    if (currentIndex - nextIndex === width) {
      return 'north';
    }
    if (nextIndex - currentIndex === width) {
      return 'south';
    }
    return '';
  }

  /**
   * Trasverse the tree using DFS and finding the shortest path
   * @returns number[]
   * @param {Node[]} nodes 
   * @param {number} currentIndex 
   * @param {number} goalIndex 
   * @param {number} ghostIndex 
   * @param {number[]} path 
   * @param {Array.<number[]>} solution
   */
  _traverseDfs(nodes, currentIndex, goalIndex, ghostIndex, path, solution) {
    const currentNode = nodes[currentIndex];
    if (currentNode.visited) return;
    currentNode.visited = true;
    currentNode.path = path;
    if (currentIndex === goalIndex) {
      path.push(currentIndex);
      solution.push([...path]);
      return solution;
    };
    path.push(currentIndex);
    for (let i = 0; !solution.length && i < currentNode.children.length; i++) {
      const childIndex = currentNode.children[i];
      if (true || !(childIndex === ghostIndex)) { // TODO: Improve ghost avoidance strategy
        this._traverseDfs(nodes, childIndex, goalIndex, ghostIndex, path, solution);
      }
    }
    path.pop();
    return solution[0];
  }

  /**
   * builds a list of nodes that hold a list of its adjacent nodes
   * @returns Nodes[]
   */
  _buildAdjacencyListNodes() {
    const data = this.state.data;
    const [width, height] = this.state.size;

    const maze = [];
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const index = (h * width) + w;
        maze[index] = [];
        const blocks = data[index]; // blocked directions
        if (h + 1 < height && data[index + width].includes('north')) blocks.push('south');
        if (w + 1 < width && data[index + 1].includes('west')) blocks.push('east');
        if (w + 1 === width) blocks.push('east');
        if (h + 1 === height) blocks.push('south');

        ['north', 'east', 'south', 'west'].forEach(direction => {
          if (!blocks.includes(direction)) {
            switch (direction) {
              case 'north': maze[index].push(index - width); break;
              case 'south': maze[index].push(index + width); break;
              case 'west': maze[index].push(index - 1); break;
              case 'east': maze[index].push(index + 1); break;
            }
          }
        });
      }
    }
    return maze.map(children => ({
      children: children,
      path: [],
      visited: false,
    }));;
  }
}

module.exports = Maze;

const common = require('./../../common');
const Maze = require('./../../../src/libs/maze');
const PonyApi = require('./../../../src/libs/ponyApi.service');
const examples = require('./../examples.js');
const { expect } = common.chai;
const sinon = common.sinon;

describe('Maze', () => {
  let maze;
  let createMazeStub;
  let getMazeStub;
  let movePonyStub;

  before(async () => {
    createMazeStub = sinon.stub(PonyApi, 'createMaze').resolves('ID');
    getMazeStub = sinon.stub(PonyApi, 'getMazeState').resolves(examples.getMazeState);
    movePonyStub = sinon.stub(PonyApi, 'movePony');
    maze = new Maze();
    await maze.initialize();
  });

  afterEach(() => {
    createMazeStub.resetHistory();
    getMazeStub.resetHistory();
    movePonyStub.resetHistory();
  });

  after(() => {
    createMazeStub.restore();
    getMazeStub.restore();
    movePonyStub.restore();
  });

  describe('MakeNextMove', () => {
    it('shoud calculate next move', async () => {
      await maze.makeNextMove();
      expect(movePonyStub).to.have.been.calledWithExactly('ID', 'west');
    });
  });

  describe('Helper methods', () => {
    let _mazeSize;
    let _mazeStateData;
    // we stub a reduced set of data
    before(() => {
      _mazeSize = maze.state.size;
      _mazeStateData = maze.state.data;
      maze.state.data = [
        ['west', 'north'],
        ['north'],
        ['west', 'north'],
        ['north'],
        ['north'],
        ['west'],
        ['west'],
        ['west'],
        ['north'],
        ['north'],
        ['west'],
        ['west', 'north'],
        [],
        ['west', 'north'],
        ['west'],
        ['west'],
        [],
        ['west', 'north'],
        [],
        ['west'],
      ];
      maze.state.size = [5, 4];
    });

    after(() => {
      maze.state.data = _mazeStateData;
      maze.state.size = _mazeSize;
    });

    it('should return valid adjacency nodes', () => {
      const result = maze._buildAdjacencyListNodes();
      const expectedChildren = [
        [1, 5],
        [0, 6],
        [3, 7],
        [2, 4],
        [3],
        [0, 10],
        [1],
        [2, 8, 12],
        [7, 9],
        [8, 14],
        [5, 15],
        [12, 16],
        [7, 11],
        [18],
        [9, 19],
        [10, 16],
        [15, 11],
        [18],
        [13, 17],
        [14],
      ];
      result.forEach(({}, i) => {
        expect(result[i]).to.have.all.keys('visited', 'children', 'path');
        expect(result[i].visited).to.be.false;
        expect(result[i].path).to.deep.equal([]);
        expect(result[i].children).to.have.all.members(expectedChildren[i]);
      });
    });

    it('should traverse using dfs and return the shortest path', () => {
      const nodes = maze._buildAdjacencyListNodes();
      const result = maze._traverseDfs(nodes, 0, 19, 2, [], []);
      expect(result).to.include.all.members([0, 5, 10, 15, 16, 11, 12, 7, 8, 9, 14, 19]);
    });

    it('should translate movement to a direction word', () => {
      expect(maze._moveToText(6, 1)).to.equal('north');
      expect(maze._moveToText(1, 6)).to.equal('south');
      expect(maze._moveToText(0, 1)).to.equal('east');
      expect(maze._moveToText(1, 0)).to.equal('west');
    });
  });
});

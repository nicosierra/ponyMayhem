const HttpClient = require('./../clients/http.client');
const config = require('config');

class PonyApiService {
  constructor(options) {
    this.client = new HttpClient(options);
  }

  /**
   * creates a new maze and returns the id of the maze
   * @returns string
   * @param {any} payload
   */
  createMaze(payload) {
    return this.client.post('/maze', payload).then(r => r.maze_id);
  }

  /**
   * returns the state of the maze
   * @returns any
   * @param {string} mazeId
   */
  getMazeState(mazeId) {
    return this.client.get(`/maze/${mazeId}`);
  }

  /**
   * returns the result of the movement
   * @returns any
   * @param {string} mazeId
   * @param {string} direction
   */
  movePony(mazeId, direction) {
    return this.client.post(`/maze/${mazeId}`, { direction });
  }

  /**
   * returns a string representing the maze along its characters
   * @returns string
   * @param {string} mazeId
   */
  printMaze(mazeId) {
    return this.client.get(`/maze/${mazeId}/print`);
  }
}

// Singleton
module.exports = new PonyApiService(config.get('pony'));

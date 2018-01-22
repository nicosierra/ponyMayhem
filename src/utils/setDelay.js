module.exports = setDelay;

/**
 * Promisified delay function
 * @returns Promise<Void>
 */
function setDelay(delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay);
  });
}

const request = require('request');

class HttpClient {
  constructor(clientOptions) {
    this._clientOptions = clientOptions;
  }

  get(url, options) {
    options = { ...options, url };
    return this._request('GET', options);
  }

  post(url, data, options) {
    options = { ...options, body: data, url };
    return this._request('POST', options);
  }

  _request(method, options) {
    const _options = { ...this._clientOptions, ...options, json: true, method };
    return new Promise((resolve, reject) => {
      request(_options, (error, response, body) => {
        if (response.statusCode >= 400) {
          error = new Error(body);
        }
        if (error) {
          reject(error);
        }
        resolve(body);
      });
    });
  }
}

module.exports = HttpClient;

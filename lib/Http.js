'use strict';

const request = require('request');
const utils = require('./utils.js');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36';

module.exports = function () {
  class Http {
    constructor() {
      this.cookies = null;
      this.referer = null;
    }

    get(url) {
      utils.log('[get]', url);
      utils.progress();
      return new Promise((success, error) => {
        request({
          uri: url,
          encoding: null,
          headers: {
            'Cookie': this.cookies || '',
            'Referer': this.referer || '',
            'User-Agent': USER_AGENT
          }
        }, (err, res) => {
          if (err || res.statusCode !== 200) {
            error('network error');
            return;
          }
          this.handleReferer(url);
          this.handleCookies(res.headers['set-cookie']);
          success(res);
        });
      });
    }

    post(options) {
      utils.log('[post]', options.url);
      utils.progress();
      return new Promise((resolve, reject) => {
        request({
          headers: {
            'Cookie': this.cookies,
            'Referer': options.referer || this.referer,
            'User-Agent': USER_AGENT
          },
          uri: options.url,
          method: 'POST',
          form: options.data,
          qsStringifyOptions: {indices: false},
          encoding: null
        }, (err, res) => {
          if (err || (res.statusCode !== 302 && res.statusCode !== 200)) {
            reject('something error');
            return;
          }
          this.handleCookies(res.headers['set-cookie']);
          resolve(res);
        });
      });
    }

    *locateWithPost(options) {
      const response = yield this.post(options);
      const location = response.headers.location;
      if (!location) {
        throw new Error('');
      }
      this.handleReferer(location);
      return yield this.handleLocation(location);
    }


    handleCookies(setCookie) {
      const cookies = [];
      setCookie.forEach(cookie => {
        cookies.push(cookie.split(';')[0]);
      });
      this.cookies = cookies.join('; ');
    }

    handleReferer(currentUrl) {
      this.referer = currentUrl;
    }

    *handleLocation(location) {
      return yield this.get(location);
    }
  }

  return Http;
};


'use strict';

const co = require('co');

class Momotaro {
  constructor() {
    this.class = {};
    this.class.Date = require('./Date.js')(this);
    this.class.Dialog = require('./Dialog.js')(this);
    this.class.Main = require('./Main.js')(this);
    this.class.Request = require('./Request.js')(this);
    this.class.UserInfo = require('./UserInfo.js')(this);
    this.class.Http = require('../Http.js')();
  }

  *run() {
    const main = new this.class.Main();
    yield this.class.UserInfo.askUserInfo();
    yield main.processThisMonth();
  }
}

module.exports = Momotaro;

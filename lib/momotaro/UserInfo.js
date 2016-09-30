'use strict';

const cli = require('../cli.js');

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

module.exports = function (M) {
  class UserInfo {
    static getUserInfo() {
      return {username, password};
    }

    static setUserInfo(userInfo) {
      if (!userInfo.username) {
        username = userInfo.username;
      }
      if (!userInfo.password) {
        password = userInfo.password;
      }
    }

    static *askUserInfo() {
      if (!username) {
        username = yield cli.question('Username? > ');
      }
      if (!password) {
        password = yield cli.question('Password? > ');
      }
    }
  }

  return UserInfo;
};

'use strict';

const co = require('co');
const Momotaro = require('./lib/momotaro/Momotaro.js');

co(function *() {
  const momotaro = new Momotaro;
  yield momotaro.run();
}).catch(e => {
  console.log(e);
  console.log(e.stack);
});

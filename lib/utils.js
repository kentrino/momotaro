'use strict';

module.exports = {
  log,
  progress
};

function log(header) {
  if (process.env.DEBUG) {
    let args = [].slice.call(arguments);
    args.shift();
    args.unshift(`\u001b[32m${header}\u001b[0m`);
    console.log.apply(null, args);
  }
}

function progress() {
  if (!process.env.DEBUG) {
    process.stdout.write('.');
  }
}

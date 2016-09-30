'use strict';

const fs = require('fs');
const readline = require('readline');
const co = require('co');
const crypto = require('crypto');
const path = require('path');

/* * * * Parse command line options.
 * * * */
let match;
let mode = '';
let rawFileName;
let secretFileName;
process.argv.forEach(v => {
  if (/\-\-mask/.exec(v)) {
    mode = 'mask';
  } else if (/\-\-unmask/.exec(v)) {
    mode = 'unmask';
  } else if (match = /\-\-file=(.+)/.exec(v)) {
    rawFileName = match[1];
  } else if (match = /\-\-secret=(.+)/.exec(v)) {
    secretFileName = match[1];
  }
});

const maskedFileName = path.format({
  dir: path.dirname(rawFileName),
  base: `${path.basename(rawFileName, path.extname(rawFileName))}.masked${path.extname(rawFileName)}`
});

function getHash(text) {
  return crypto.createHash('sha1').update(text).digest('hex');
}

function readFile(fileName) {
  const file = [];
  return new Promise((suc, err) => {
    readline.createInterface({
      input: fs.createReadStream(fileName).on('error', err),
      terminal: false
    }).on('line', line => {
      file.push(line);
    }).on('close', () => {
      suc(file);
    });
  });
}

function writeFile(fileName, data) {
  return new Promise((suc, err) => {
    const ws = fs.createWriteStream(fileName).on('error', err);
    data.forEach(v => {
      ws.write(`${v}\n`);
    });
    ws.end();
    ws.on('finish', suc);
  });
}

function mask() {
  co(function *() {
    const file = yield readFile(rawFileName);
    const secretLine = {};
    const regex = /^.*\/\/ secret$/;
    const startRegex = /^.*\/\/ <<<secret$/;
    const endRegex = /^.*\/\/ secret>>>$/;
    let secretZoneFlg = false;
    const maskedLine = file.map(v => {
      if (!!startRegex.exec(v)) secretZoneFlg = true;
      if (regex.exec(v)) {
        secretLine[getHash(v)] = v;
        return `// ${getHash(v)}`;
      }

      if (secretZoneFlg) {
        secretLine[getHash(v)] = v;
        if (endRegex.exec(v)) secretZoneFlg = false;
        return `// ${getHash(v)}`;
      }
      return v;
    });
    fs.writeFileSync(secretFileName, JSON.stringify(secretLine));
    yield writeFile(maskedFileName, maskedLine);
  }).catch(e => {
    console.log(e.stack);
  });
}

function unmask() {
  co(function *() {
    const file = yield readFile(maskedFileName);
    const secret = require(path.resolve('.', secretFileName));
    const regex = /\/\/ ([a-f\d]{40})/;
    let match;
    const rawFile = file.map(v => {
      if (match = regex.exec(v)) {
        return secret[match[1]];
      }
      return v;
    });
    console.log(rawFile);
    writeFile(rawFileName, rawFile);
  }).catch(e => {
    console.log(e.stack);
  });
}

if (mode === 'mask') {
  mask();
} else if (mode === 'unmask') {
  unmask();
}

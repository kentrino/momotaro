'use strict';

const Scraper = require('./lib/Scraper.js');
const fs = require('fs');
const qs = require('qs');
const urlencode = require('urlencode');

function decodeRecursively(obj) {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'string') {
      obj[k] = urlencode.decode(obj[k], 'shift_jis');
    } else {
      obj[k] = decodeRecursively(obj[k]);
    }
  });
  return obj;
}

function getDiffRecursively(a, b, keys) {
  let newKeys;
  if (typeof keys === 'undefined') {
    newKeys = [];
  } else {
    newKeys = keys.concat();
  }
  const newKeyIndex = newKeys.length;

  if (typeof a !== 'undefined') {
    Object.keys(a).forEach(i => {
      if (typeof a[i] === 'string' || typeof a[i] === 'number') {
        if (typeof b === 'object') {
          if (a[i] !== b[i]) {
            newKeys[newKeyIndex] = i;
            console.log('[', newKeys.join(' > '), ']', `\u001b[31m${a[i]}\u001b[0m`, `\u001b[32m${b[i]}\u001b[0m`);
          }
        } else {
          newKeys[newKeyIndex] = i;
          console.log('[', newKeys.join(' > '), ']', `\u001b[31m${a[i]}\u001b[0m`, `\u001b[32m${b} (parent)\u001b[0m`);
        }
      } else {
        newKeys[newKeyIndex] = i;
        getDiffRecursively(a[i], b[i], newKeys);
      }
    });
  }
}

const html = fs.readFileSync('./something_ugly.html');
const scraper = new Scraper().setHtml(html);
scraper.moveTo('body > form:nth-child(2)');
const query = require('./ugly_query.js');

getDiffRecursively(decodeRecursively(qs.parse(query)), scraper.parseAllForms());
getDiffRecursively(scraper.parseAllForms(), decodeRecursively(qs.parse(query)));

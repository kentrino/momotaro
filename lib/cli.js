'use strict';

const readline = require('readline');
const Buffer = require('buffer').Buffer;

// Control sequences
const ESC = '\u001b[';
const VISIBLE_CURSOR = `${ESC}?25h`;
const INVISIBLE_CURSOR = `${ESC}?25l`;
const DELETE_LINE = `${ESC}2K`;
const CURSOR_LEFT = `${ESC}1G`;
const CURSOR_DOWN = `${ESC}1B`;

const HIGHLIGHT = `${ESC}44;37;1m`;
const GREEN = `${ESC}32m`;
const RESET = `${ESC}0m`;
const ARROW_UP = new Buffer(`${ESC}A`);
const ARROW_DOWN = new Buffer(`${ESC}B`);
const ARROW_RIGHT = new Buffer(`${ESC}C`);
const ARROW_LEFT = new Buffer(`${ESC}D`);

// Keys
const SIGINT = new Buffer([3]);
const EOT = new Buffer([4]);
const ENTER = new Buffer([13]);

function question(message) {
  return new Promise((suc, err) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(message, reply => {
      rl.close();
      suc(reply);
    });
  });
}

function select(message, options) {
  const startRaw = () => {
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdout.write(INVISIBLE_CURSOR);
  };

  const finishRaw = () => {
    process.stdin.removeAllListeners('data');
    process.stdin.pause();
    process.stdin.setRawMode(false);
    process.stdout.write(VISIBLE_CURSOR);
    process.stdout.write('\n');
  };

  const buildOption = index => {
    const line = [];
    const header = '  ';
    const separator = '    ';
    options.forEach((option, i) => {
      if (i === index) {
        line.push(HIGHLIGHT + option + RESET);
      } else {
        line.push(option);
      }
    });
    return header + line.join(separator);
  };

  const deleteLine = () => {
    process.stdout.write(DELETE_LINE);
    process.stdout.write(CURSOR_LEFT);
  };


  return new Promise((suc, err) => {
    let index = 0;

    process.stdout.write(`${message}`);

    startRaw();

    process.stdout.write(buildOption(index));
    process.stdin.on('data', buf => {
      if (!buf.compare(SIGINT) || !buf.compare(EOT)) {
        finishRaw();
        process.exit(0);
      }
      if (!buf.compare(ARROW_LEFT)) {
        index = (index - 1 + options.length) % options.length;
        deleteLine();
        process.stdout.write(buildOption(index));
      }
      if (!buf.compare(ARROW_RIGHT)) {
        index = (index + 1) % options.length;
        deleteLine();
        process.stdout.write(buildOption(index));
      }
      if (!buf.compare(ENTER)) {
        finishRaw();
        suc(index);
      }
    });
    // TODO:
    process.stdin.on('end', () => {
    });
  });
}

function green(message) {
  return GREEN + message + RESET;
}

module.exports = {
  question,
  select,
  green
};

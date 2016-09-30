'use strict';

const cli = require('../cli.js');
const clone = require('../clone.js');

module.exports = function (M) {
  class Dialog {
    static message(msg) {
      console.log(msg);
    }

    static *askFill(dateData, newDateData, dateStr) {
      const buildMessage = () => {
        let message = '';
        message += `\n> ${dateStr} --------- \n`;
        message += cli.green('[start] ');
        message += `${newDateData.start} (in: ${dateData.enter})\n`;
        message += cli.green('[end] ');
        message += `${newDateData.end} (out: ${dateData.leave})\n`;
        message += cli.green('[rest] ');
        message += `${newDateData.rest}\n`;
        message += cli.green('[working] ');
        message += `${newDateData.working}\n`;
        return message;
      };
      const value = yield cli.select(buildMessage(), ['OK', 'Modify']);
      return value === 0;
    }

    static *manualFill(dateData) {
      const newDateData = {};
      clone(newDateData, dateData);
      newDateData.start = yield cli.question(`Starting time (in: ${dateData.enter}) > `);
      newDateData.end = yield cli.question(`Closing time (in: ${dateData.leave}) > `);
      return newDateData;
    }
  }

  return Dialog;
};

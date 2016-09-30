'use strict';

const moment = require('moment');
const cli = require('../cli.js');
const dateUtils = require('../date_utils.js');

require('events').EventEmitter.defaultMaxListeners = 100;

module.exports = function (M) {
  class Main {
    constructor() {
      this.req = new M.class.Request;
      this.dataThisMonth = null;
    }

    isPreviousMonthRequired() {
      const now = moment();
      const aWeekAgo = now.add(-7, 'days');
      return aWeekAgo.month() !== now.month();
    }

    *fill(calender) {
      const filledData = [];
      for (let i = 0; i < calender.data.length; i++) {
        const r = calender.data[i];
        const dateStr = dateUtils.buildDate(i, calender.month);
        if (M.class.Date.shouldBeFilled(r)) {
          if (M.class.Date.canAutoFill(r)) {
            filledData[i] = yield M.class.Date.autoFill(r, dateStr);
          } else {
            filledData[i] = yield M.class.Date.customFill(r, dateStr);
          }
        }
      }
      return calender.data;
    }

    // deprecated
    getUpdatedDateIndicesOfWeeks(dateIndices, month) {
      const mondayIndices = [];
      dateIndices.forEach(v => {
        mondayIndices.push(dateUtils.getStartOfAWeek(v, month));
      });
      // get unique
      return Array.from(new Set(mondayIndices)).sort((a, b) => a - b);
    }

    getWeeklyDataFromDateIndex(calenderData, mondayIndex) {
      return calenderData.slice(mondayIndex, mondayIndex + 7);
    }

    validate(weeklyData) {
      let result = true;
      for (const dateData of weeklyData) {
        if (M.class.Date.invalid(dateData)) {
          result = false;
        }
      }
      return result;
    }

    *saveWeek(filledData, dateIndexOfUpdatedWeek, isPreviousMonth, month) {
      let res = yield this.req.getThisMonth();
      if (isPreviousMonth) {
        res = yield this.req.getPreviousMonth(res);
      }
      const weeklyData = this.getWeeklyDataFromDateIndex(filledData, dateIndexOfUpdatedWeek);

      // TODO: 運用対象外への対応
      res = yield this.req.getWeeklyCalender(res, dateIndexOfUpdatedWeek);
      res = yield this.req.save(res, weeklyData);
      M.class.Dialog.message('\nSuccessfully saved!');

      const canSendApprovalRequest = this.validate(weeklyData);
      if (canSendApprovalRequest) {
        let message = `\nThe week of ${dateUtils.buildDate(dateIndexOfUpdatedWeek, month)}\n`;
        message += '> Send an approval request?\n';
        const noApprovalRequest = yield cli.select(message, ['Yes', 'No']);
        if (!noApprovalRequest) {
          res = yield this.req.send(res);
          M.class.Dialog.message('\nAn approval request is successfully sent!');
        }
      } else {
        M.class.Dialog.message('\nYou can send an approval request in the next week.');
      }
    }

    *processMonth(isPreviousMonth) {
      yield this.req.getSession();
      yield this.req.login();
      let res = yield this.req.getThisMonth();
      if (isPreviousMonth) {
        res = yield this.req.getPreviousMonth(res);
      }
      const calender = this.req.parseMonthlyResponse(res);

      const filledData = yield this.fill(calender);
      const dateIndices = dateUtils.getAllDateIndicesOfWeeks(calender.month);

      // TODO: 非同期対応（クッキー切り替え）
      // yield dateIndices.map(dateIndex => this.processWeek(filled.data, dateIndex, isPreviousMonth, calender.month));
      for (const dateIndex of dateIndices) {
        yield this.saveWeek(filledData, dateIndex, isPreviousMonth, calender.month);
      }
    }

    processThisMonth() {
      return this.processMonth(false);
    }

    processPreviousMonth() {
      return this.processMonth(true);
    }
  }

  return Main;
};


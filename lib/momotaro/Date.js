'use strict';

const moment = require('moment');
const dateUtils = require('../date_utils.js');


module.exports = function (M) {
  class Date {
    static calcRestAndWorking(dateData) {
      dateData.rest = dateUtils.calcRest(dateData.start, dateData.end);
      dateData.working = dateUtils.calcWorkingTime(dateData.start, dateData.end, dateData.rest);
      return dateData;
    }

    static createAutoFillData(dateData) {
      const rest = dateUtils.calcRest(dateData.start, dateData.end);
      const newDateData = dateUtils.calcAutoFill(dateData.enter, dateData.leave, rest);
      return newDateData;
    }

    static _getLastDayOfAWeek(dateIndex, month) {
      return moment(month, 'YYYY/MM').date(dateIndex + 1).day(7).format('MMMM Do YYYY');
    }

    static *autoFill(dateData, dateStr) {
      let newDateData = this.createAutoFillData(dateData);

      const ok = yield M.class.Dialog.askFill(dateData, newDateData, dateStr);
      if (!ok) {
        newDateData = yield this.customFill(dateData, dateStr);
      }
      return newDateData;
    }

    static invalid(r) {
      return !r.holiday && (!r.start || !r.end || !r.rest || !r.working);
    }

    static shouldBeFilled(r) {
      return this.invalid(r) && r.leave && r.enter;
    }

    static canAutoFill(r) {
      return r.enter && r.leave;
    }

    static *customFill(dateData, dateStr) {
      let newDateData = yield M.class.Dialog.manualFill(dateData);
      this.calcRestAndWorking(newDateData);
      const ok = yield M.class.Dialog.askFill(dateData, newDateData, dateStr);
      if (!ok) {
        newDateData = yield this.customFill(dateData, dateStr);
      }
      return newDateData;
    }
  }
  return Date;
};


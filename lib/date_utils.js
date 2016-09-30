'use strict';

const moment = require('moment');

const calcAutoFill = (enter, leave, rest) => {
  const atOfficeMinutes = toMinutes(sub(sub(leave, enter), rest));
  const workingMinutes = ((atOfficeMinutes - 4) / 10 | 0) * 10;
  const startMargin = (atOfficeMinutes - workingMinutes) / 2 | 0;
  const endMargin = (atOfficeMinutes - workingMinutes) - startMargin;
  const start = format(toMinutes(enter) + startMargin);
  const end = format(toMinutes(leave) - endMargin);
  const working = sub(format(workingMinutes), rest);
  return {start, end, working, enter, leave};
};

const calcWorkingTime = (start, end, rest) => sub(sub(end,start), rest);

const calcRest = (start, end) => {
  let rest = '0000';
  if (subMinutes(end, start) > 7.5 * 60) {
    rest = '0100';
  }
  return rest;
};

const buildDate = (dateIndex, month) => moment(month, 'YYYY/MM').date(dateIndex + 1).format('MMMM Do YYYY');

const getStartOfAWeek = (dateIndex, month) => {
  if (moment(month, 'YYYY/MM').date(dateIndex + 1).weekday() === 0) {
    if (moment(month, 'YYYY/MM').date(dateIndex + 1).weekday(-6).date() > 20) {
      return 0;
    }
    return moment(month, 'YYYY/MM').date(dateIndex + 1).weekday(-6).date() - 1;
  }
  if (moment(month, 'YYYY/MM').date(dateIndex + 1).weekday(1).date() > 27) {
    return 0;
  }
  return moment(month, 'YYYY/MM').date(dateIndex + 1).weekday(1).date() - 1;
};

const getLastDateIndex = month => moment(month, 'YYYY/MM').endOf('month').date() - 1;

const getAllDateIndicesOfWeeks = month => {
  const startOfAWeekIndices = [];
  const last = getLastDateIndex(month);
  for (let i = 0; i < last; i++) {
    startOfAWeekIndices.push(getStartOfAWeek(i, month));
  }
  return Array.from(new Set(startOfAWeekIndices)).sort((a, b) => a - b);
};

const getDateIndexOfToday = () => moment().date();

const getStart = enter => format(Math.ceil((toMinutes(enter) + 1) / 5) * 5);

const getEnd = enter => format(Math.floor((toMinutes(enter) - 1) / 5) * 5);

const subMinutes = (end, start) => toMinutes(sub(end, start));

const toMinutes = v => (parseInt(v, 10) / 100 | 0) * 60 + parseInt(v, 10) % 100;

const leftPad = function (num) {
  const str = num.toString();
  return '00'.substr(str.length) + str;
};

const leftPadStr = function (strNum) {
  return '0000'.substr(strNum.length) + strNum;
};

const format = function (timeInMinutes) {
  const hour = timeInMinutes / 60 | 0;
  const minute = timeInMinutes % 60;
  return leftPad(hour) + leftPad(minute);
};

const sub = (a, b) => format(toMinutes(a) - toMinutes(b));

module.exports = {
  calcWorkingTime,
  calcAutoFill,
  getStart,   //
  getEnd,     //
  subMinutes,
  leftPadStr, // leftPadStr4
  calcRest,
  getDateIndexOfToday,
  getStartOfAWeek,
  buildDate,
  getLastDateIndex,
  getAllDateIndicesOfWeeks
};

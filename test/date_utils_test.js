'use strict';

const assert = require('assert');
const dateUtils = require('../lib/date_utils.js');
const sinon = require('sinon');

describe('date_utils', () => {
  describe('calcAutoFill', () => {
    it('case 1', () => {
      const date = dateUtils.calcAutoFill('0800', '2000', '0100');
      assert.deepEqual(date, {start: '0805', end: '1955', working: '0950', enter: '0800', leave: '2000'});
    });

    it('case 2', () => {
      const date = dateUtils.calcAutoFill('0801', '2000', '0100');
      assert.deepEqual(date, {start: '0805', end: '1955', working: '0950', enter: '0801', leave: '2000'});
    });

    it('case 3', () => {
      const date = dateUtils.calcAutoFill('0807', '2000', '0100');
      assert.deepEqual(date, {start: '0813', end: '1953', working: '0940', enter: '0807', leave: '2000'});
    });
  });

  describe('calcRest', () => {
    it('case 1', () => {
      const rest = dateUtils.calcRest('0800', '1530');
      assert.equal(rest, '0000');
    });

    it('case 2', () => {
      const rest = dateUtils.calcRest('0800', '1531');
      assert.equal(rest, '0100');
    });
  });

  describe('calcWorkingTime', () => {
    it('case 1', () => {
      const working = dateUtils.calcWorkingTime('0800', '2000', '0100');
      assert.equal(working, '1100');
    });
  });

  describe('getDateIndexOfToday', () => {
    it('returns correct value', () => {
      const fakeClock = sinon.useFakeTimers(new Date(2015, 9, 20).getTime());
      const dateIndex = dateUtils.getDateIndexOfToday();

      assert.equal(dateIndex, 20);
      fakeClock.restore();
    });
  });

  describe('getStartOfAWeek', () => {
    it('returns 0 when the first week of a month', () => {
      const ret = dateUtils.getStartOfAWeek(0, '2016/04');
      assert.equal(ret, 0);
    });

    it('returns 0 when Sunday of the first week of a month', () => {
      const ret = dateUtils.getStartOfAWeek(2, '2016/04');
      assert.equal(ret, 0);
    });

    it('returns Monday\'s date index when Monday', () => {
      const ret = dateUtils.getStartOfAWeek(3, '2016/04');
      assert.equal(ret, 3);
    });

    it('returns last Monday\'s when Sunday ', () => {
      const ret = dateUtils.getStartOfAWeek(9, '2016/04');
      assert.equal(ret, 3);
    });

    it('returns Monday\'s otherwise', () => {
      const ret = dateUtils.getStartOfAWeek(5, '2016/04');
      assert.equal(ret, 3);
    });
  });

  describe('buildDate', () => {
    it('returns correct value', () => {
      const ret = dateUtils.buildDate(3, '2016/4');
      assert.equal(ret, 'April 4th 2016');
    });
  });

  describe('getLastDateIndex', () => {
    it('returns correct value', () => {
      const ret = dateUtils.getLastDateIndex('2016/4');
      assert.equal(ret, 29);
    });
  });

  describe('getAllDateIndicesOfWeeks', () => {
    it('works correctly', () => {
      const ret = dateUtils.getAllDateIndicesOfWeeks('2016/4');
      assert.deepEqual(ret, [0, 3, 10, 17, 24]);
    });
  });
});



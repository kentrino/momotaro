'use strict';

const $ = require('cheerio');

module.exports = function () {
  let encoder = str => str;

  this.setHtml = html => {
    this.$ = $.load(html);
    return this;
  };

  this.parseAllForms = () => {
    const map = {};

    const add = (name, value) => {
      if (typeof map[name] === 'undefined') {
        map[name] = value;
      } else {
        if (typeof map[name] === 'string') {
          const tmp = map[name];
          map[name] = [tmp, value];
        } else {
          map[name].push(value);
        }
      }
    };

    const addInput = function () {
      const value = encoder($(this).val());
      if (typeof $(this).attr('name') !== 'undefined') {
        const name = $(this).attr('name');
        add(name, value);
      }
    };

    this.$('input').each(addInput);
    this.$('textarea').each(addInput);
    this.$('select').each(function () {
      const name = $(this).attr('name');
      $(this).find('option:selected').each(function () {
        add(name, $(this).val());
      });
    });
    return map;
  };

  // this.value = selector => this.$(selector).attr('value');
  this.moveTo = selector => this.setHtml(this.$(selector).html());

  this.find = selector => this.$(selector);
};

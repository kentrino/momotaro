'use strict';

const moment = require('moment');
const Scraper = require('../Scraper.js');
const dateUtils = require('../date_utils.js');

const Iconv = require('iconv').Iconv;
const iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');

module.exports = function (M) {
// 6031daac8b39ab353d613554353e4b715e538414
// 94fc3b164a33ec5ef39094622723b8154263bb39

  // handle momotaro request
  class Request {
    constructor() {
      const userInfo = M.class.UserInfo.getUserInfo();
      this.username = userInfo.username;
      this.password = userInfo.password;

      this.res = null;

      this.http = new M.class.Http;
    }

    *getSession() {
// dbf2aa24cea5d5aa9121b1c9d17a0fb607419d61
    }

    *login() {
      const data = {
// 8cb0e0da20b38df69e4da274627fe222a63ffe72
// 040c01b62bc979f869a98d28b72d50dc300e0556
// fd84c5830bef55b28bbd21415186fb0c9946d83d
// 378ff0613fd5d659d37a2d8d3e03c6446bd734ef
      };
// ab1cc84dff3e07f685a95c320e7809955daa9664
      const options = {url, data};
      return yield this.http.locateWithPost(options);
    }

    *getMenu() {
      const response = yield this.getMain();
      const scraper = new Scraper().setHtml(response.body);
      const menuUrl = scraper.find('frameset > frame:nth-child(1)').attr('src');
// 4db71115972b210cfbf451c0a3f5b29dd4b1ceb9
    }

    *getMain() {
      const data = {
// ff34e78f26ebb68657877f6012eda88f7964055e
// 498bc8b735df42d8518c59b8ca99d1c094d037dd
      };
      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }

    *getThisMonth(menuResponse) {
// 4ad1775a373b4ec28a6b8c5474fa2411eb3befbd
      if (!menuResponse) {
// a6909531f04c07e97e76c93b1343f4fc067f7637
      } else {
        const scraper = new Scraper().setHtml(menuResponse.body);
// 62634daa7742a18aafbc65e234d4412a6c4ae68c
      }

      const data = {
// c93a61b64340bcd5d025e9bdd235a334dc963a53
// c4a4734ae766742c0f0886a759d8aaef3266b0ae
// 49a6b57a0d43450ad9b515e8eaf9f3af92687489
// 06a36ddfc053a442b3ce9723c7c2037c73ca9cbb
// bcd33e80a7de01da7d4c225cde930f575d8d1bf5
// 6100dd0aaf51f2ff159111b4206d03da82d8aae0
// aa6991c04644ee31d884514792565f97595e60c4
// 286d397e7b8bb5586d77df18058c0b6a5861bc9d
// c4a2cbdf132f94049d91feb5d306a299a60bb5a7
// b99619094be00184e064f44b7aacb011a6a0ea20
// 400f2508ef61197db63e78735b4e8a62a9de79cd
      };
      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }

    *getPreviousMonth(thisMonthResponse) {
      const scraper = new Scraper().setHtml(thisMonthResponse.body);
      const data = scraper.moveTo('body > form:nth-child(3)').parseAllForms();
// df10ee6dc8deeb001cd66511c5f6689b8ff92ef2
      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }

    getMonthFromResponse(monthlyResponse) {
      const scraper = new Scraper().setHtml(monthlyResponse.body);
// e6221e44b75e6c65f2f33d6987a5322a09ecd08f
      return month;
    }

    parseMonthlyResponse(calenderResponse) {
      const scraper = new Scraper().setHtml(iconv.convert(calenderResponse.body).toString());
// ec43d95d9966c768eb056a7c9f6b979634ef912a

      // parse main data
      const mainData = [];
      const day = {'月': 0, '火': 1, '水': 2, '木': 3, '金': 4, '土': 5, '日': 6};
// 9c90a7dc5d5209942aba667f44f9475dbb527e79
      let match;
      const dateParseRegex = /(\d{2})\/(\d{2})\((.)\)/;
      const lastDateIndex = moment(monthOfCalender, 'YYYY/MM').endOf('month').date();
      for (let i = 0; i < lastDateIndex; i++) {
        const row = {};
        Object.keys(columns).forEach(v => {
// ef7340fe744c591e854c3cb5c8a50d4ab97899b3
          row[columns[v]] = row[columns[v]].replace(':', '');
          if (row[columns[v]]) {
            row[columns[v]] = dateUtils.leftPadStr(row[columns[v]]);
          }
        });
// 8ca23dc0299818fa36d3258e1bae55df0709476d
// b875e95df73f392603dfb3487e9ce73c0264e7ea
// 5e334870d13a4a15dece52855a7689956bf63b7d

// 784ae6f1753158f29d5adf655202e80d8ae5e5cc
        if (match = dateParseRegex.exec(dateStr)) {
          row.date = parseInt(match[2], 10) - 1;
          row.day = day[match[3]];
        }
        mainData.push(row);
      }
      return {data: mainData, month: monthOfCalender};
    }

    *getWeeklyCalender(calenderResponse, dateIndex) {
      const scraper = new Scraper().setHtml(calenderResponse.body);
      const data = scraper.moveTo('body > form:nth-child(3)').parseAllForms();
// 81120da7ced6c40c45f3b97b051cda3ca590c55c
// d385932d6132633ad91271b3f775e56d2576d8fb
      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }

    // dayIndex get 0 when monday.
    *save(weeklyCalenderResponse, values) {
      const scraper = new Scraper().setHtml(weeklyCalenderResponse.body);
      const data = scraper.moveTo('body > form:nth-child(2)').parseAllForms();

      const setTime = function (val, type, dateIndices) {
// 947eb92ba3339ed8453b0aae2ca70d9ecaabd3fc
// 08f164a465e1faf6b735084bc25eb60de77b5697
      };

      values.forEach((v, i) => {
// 2ff400c7d50ff9c801542d386b03913dc3966bd0
// a0941c844b90fd144ed5fa08cab76bdb2e35f9d3
// 44c73c9d66ddb4c8fee58881def37e757ae97b6b
// 43fcecce8b84ed8dcec3630247076af5d21eb597
// ce5f32d88a8e28ee8bde268c5aa6cb16e96a8a13
// da39a3ee5e6b4b0d3255bfef95601890afd80709
// 6261ca581fbcd2d4ce1d4a69825ce7d75cb96619

      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }

    *send(weeklyCalenderResponse) {
      const scraper = new Scraper().setHtml(weeklyCalenderResponse.body);
      const data = scraper.moveTo('body > form:nth-child(2)').parseAllForms();

// 3492076087f60a3e612daa2bce3fcd64365ab294

      const url = urlForLocation;
      return yield this.http.locateWithPost({url, data});
    }
  }

  return Request;
};

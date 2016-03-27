'use strict';
const request = require('request-promise');
const moment = require('moment');
const currencies = require('../common/currencies');
const logger = require('../logger');

// json ex.: [{"r030":978,"txt":"Євро","rate":29.266108,"cc":"EUR","exchangedate":"23.03.2016"}]
function nbuTransform(body) {
  return {
    bank: 'NBU',
    ccy: body[0].cc,
    base_ccy: 'UAH',
    buy: parseFloat(body[0].rate),
    sale: parseFloat(body[0].rate)
  };
}

// http://www.bank.gov.ua/control/uk/publish/article?art_id=25327817
// uri ex.: http://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=EUR&date=20160323
function requestApi(reqMoment, currency) {
  const options = {
    uri: 'http://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&' +
      `&valcode=${currency}&date=${reqMoment.format('YYYYMMDD')}`,
    json: true,
    transform: nbuTransform
  };

  // promise
  return request(options);
}

// request rates for a given 'date' and update in storage
function updateDay(reqMoment, storage) {
  // NBU API returns [] on Saturday & Sunday
  const noWeekendsMoment = moment(reqMoment);
  if (reqMoment.isoWeekday() === 6) noWeekendsMoment.add(2, 'days');      // next Monday
  else if (reqMoment.isoWeekday() === 7) noWeekendsMoment.add(1, 'day');  // next Monday

  currencies.forEach(cur => {
    requestApi(noWeekendsMoment, cur)
      .then(json => Object.assign({ date: reqMoment.format('YYYY-MM-DD') }, json))
      .then(rate => storage.update(rate))
      .catch(err => logger.error(err));
  });
}

module.exports.updateTodayRates = function updateTodayRates(storage) {
  const todayMoment = moment().startOf('day');
  updateDay(todayMoment, storage);
};

module.exports.updateLastWeekRates = function updateLastWeekRates(storage) {
  for (let i = 1; i <= 8; i++) {
    const reqMoment = moment().subtract(i, 'days').startOf('day');
    updateDay(reqMoment, storage);
  }
};

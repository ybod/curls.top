'use strict';
const request = require('request-promise');
const moment = require('moment');
const currencies = require('../common/currencies');
const logger = require('../logger');
const _ = require('lodash');

// json ex.: [{"ccy":"USD","base_ccy":"UAH","buy":"25.70000","sale":"26.59574"},
//  {"ccy":"EUR","base_ccy":"UAH","buy":"28.70000","sale":"29.76190"},...]
function cardTransform(body) {
  return body
    .filter(rate => _.includes(currencies, rate.ccy))
    .map(rate => ({
      bank: 'PrivatBank',
      ccy: rate.ccy,
      base_ccy: rate.base_ccy,
      buy: parseFloat(rate.buy),
      sale: parseFloat(rate.sale),
      date: moment().startOf('day').format('YYYY-MM-DD')
    }));
}

// https://api.privatbank.ua/exchangerate.html
// uri ex.: https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11
function requestApi() {
  const options = {
    uri: 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11',
    json: true,
    transform: cardTransform
  };

  // promise
  return request(options);
}

// update rates in storage (Privat rates for Card available for today only)
module.exports.updateTodayRates = function updateTodayRates(storage) {
  requestApi()
    .then(rates => rates.forEach(rate => storage.update(rate)))
    .catch(err => logger.error(err));
};

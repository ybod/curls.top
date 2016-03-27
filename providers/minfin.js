'use strict';
const request = require('request-promise');
const moment = require('moment');
const currencies = require('../common/currencies');
const logger = require('../logger');
const _ = require('lodash');

// json ex.: {"usd":{"ask":21.9,"bid":22,"askCount":"458","askSum":"4973113.00",
// "bidCount":"338","bidSum":"4500310.00"},"eur":...}
function auctionTransform(body) {
  return Object.keys(body)
    .filter(key => _.includes(currencies, key.toUpperCase()))
    .map(key => ({
      bank: 'BlackMarket',
      ccy: key.toUpperCase(),
      base_ccy: 'UAH',
      buy: parseFloat(body[key].ask),
      sale: parseFloat(body[key].bid),
      date: moment().startOf('day').format('YYYY-MM-DD')
    }));
}

// Auction ("Black Market"): http://minfin.com.ua/help/api/mb/
// uri ex.: http://api.minfin.com.ua/auction/info/[MINFIN_KEY]/
function requestApi() {
  const minfinKey = process.env.MINFIN_KEY;   // You must set env. variable MINFIN_KEY=...
  const options = {
    uri: `http://api.minfin.com.ua/auction/info/${minfinKey}/`,
    headers: {
      'User-Agent': 'Curls/0.7 (http://curls.top)'
    },
    json: true,
    transform: auctionTransform
  };

  // promise
  return request(options);
}

// update rates in storage (Auction data is only available for today)
module.exports.updateTodayRates = function updateTodayRates(storage) {
  requestApi()
    .then(rates => rates.forEach(rate => storage.update(rate)))
    .catch(err => logger.error(err));
};

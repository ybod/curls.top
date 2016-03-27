'use strict'
const providers = require('./providers');
const moment = require('moment');
const logger = require('./logger');
const storage = require('./storage/storage');
const _ = require('lodash');
const Promise = require('bluebird');

const currencies = require('./common/currencies');
const banks = require('./common/banks');

const todayInterval = moment.duration(15, 'minutes').asMilliseconds();
const lastWeekInterval = moment.duration(1, 'hour').asMilliseconds();

function updateRates(updateFunc) {
  providers.forEach(provider => {
    if (typeof provider[updateFunc] === 'function') {
      provider[updateFunc](storage);
    }
  });
}

module.exports.startUpdatingRates = function startUpdatingRates() {
  setInterval(updateRates, todayInterval, 'updateTodayRates');
  setInterval(updateRates, lastWeekInterval, 'updateLastWeekRates');
};

module.exports.getWeeklyRates = function getWeeklyRates(weekMoments) {
  const redisPromises = [];

  for (const m of weekMoments) {
    for (const b of banks) {
      for (const c of currencies) {
        redisPromises.push(storage.get(b, c, m));
      }
    }
  }

  return Promise.all(redisPromises)
    .then(data => data.filter(d => !!d))
    .then(data => _.groupBy(data, 'date'))
    .catch(err => logger.error(err));
};

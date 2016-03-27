'use strict';
const moment = require('moment');
const logger = require('../logger');
const validate = require('./validate');
const constraints = require('./constraints');

const Redis = require('ioredis');
const redis = new Redis();

const ttl = moment.duration(10, 'days').asSeconds();            // TTL for redis records

// key examples:
// BlackMarket:USD:2016-03-19
// PrivatBank:EUR:2016-03-19
// NBU:USD:2016-03-19
function composeKey(data) {
  return `${data.bank}:${data.ccy}:${data.date}`;
}

function get(bank, ccy, dateMoment) {
  const key = composeKey({
    bank,
    ccy,
    date: dateMoment.startOf('day').format('YYYY-MM-DD')
  });

  return redis.get(key).then(str => JSON.parse(str));
}

function getPrevious(data) {
  const prevMoment = moment(data.date).subtract(1, 'day');

  return get(data.bank, data.ccy, prevMoment);
}

function updateDiff(prev, data) {
  let buydiff = 0;
  let salediff = 0;

  if (!!prev && !!prev.buy && !!prev.sale) {
    buydiff = data.buy - prev.buy;
    salediff = data.sale - prev.sale;
  }

  return Object.assign({ buydiff, salediff }, data);
}

module.exports.update = function update(data) {
  validate.async(data, constraints)
    .then(() => getPrevious(data))
    .then(prev => updateDiff(prev, data))
    .then(updated => redis.set(composeKey(updated), JSON.stringify(updated), 'EX', ttl))
    .catch(err => logger.error(err));
};

module.exports.get = get;

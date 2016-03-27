'use strict';
const banks = require('../common/banks');
const currencies = require('../common/currencies');

// bank:  NBU, PrivatBank, BlackMarket...
// ccy: USD, EUR
// base_ccy: UAH
// buy: 0.0
// sale: 0.0
// buydiff +0.0/-0.0/undefined (difference with a previous day)
// salediff +0.0/-0.0/undefined (difference with a previous day)
// date: 'YYYY-MM-DD'

module.exports = {
  bank: { presence: true, inclusion: banks },
  ccy: { presence: true, inclusion: currencies },
  base_ccy: { presence: true, inclusion: ['UAH'] },
  buy: { presence: true, numericality: true },
  sale: { presence: true, numericality: true },
  buydiff: { presence: false, numericality: true },
  salediff: { presence: false, numericality: true },
  date: { presence: true, date: true }
};

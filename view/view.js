'use strict';
const moment = require('moment');
const controller = require('../controller');
const _ = require('lodash');
const txtFmt = require('./txt-formatter');
const Promise = require('bluebird');

const currencies = require('../common/currencies');
const banks = require('../common/banks');

function text() {
  const weekMoments = _.times(7, i => moment().subtract(i, 'day'));

  const textPromise = controller.getWeeklyRates(weekMoments).then(rates => {
    let txt = '\n';

    for (const m of weekMoments.reverse()) {
      // 'table' header
      txt += txtFmt.header(m, currencies);

      // 'table' body
      const dayRate = rates[m.format('YYYY-MM-DD')];
      if (!dayRate) {
        continue;
      }

      for (const b of banks) {
        txt += txtFmt.str(b, currencies, dayRate);
      }

      txt += '\n';
    }

    const latestNBURates = rates[weekMoments.pop().format('YYYY-MM-DD')];
    txt += txtFmt.footer(150, latestNBURates);
    return txt;
  });

  return textPromise;
}

function html() {
  return new Promise(resolve => {
    const mk = '<head><link rel="stylesheet" type="text/css"' +
      ' href="http://thomasf.github.io/solarized-css/solarized-dark.min.css"></head>' +
      '<body><p><b>curls</b>: UAH exchange rates simply put into Your shell</p>' +
      '<p>curl curls.top</p>' +
      '<p>Check this project on GitHub: <a href="https://github.com/Molly101/curls.top">Curls.top</a></p></body>';

    resolve(mk);
  });
}

module.exports.text = text;
module.exports.html = html;

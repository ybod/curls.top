'use strict';
const chalk = require('chalk');
chalk.enabled = true;

const bankTxt = {
  NBU: `${chalk.cyan('NBU')}\t\t`,
  PrivatBank: `${chalk.yellow('PrivatBank')}\t`,
  BlackMarket: `${chalk.dim('BlackMarket')}\t`
};

const curTxt = {
  USD: chalk.green.inverse(`USD (UAH)${' '.repeat(8)}`),
  EUR: chalk.blue.inverse(`EUR (UAH)${' '.repeat(8)}`)
};

function arrow(diff) {
  let arrSym = ' ';
  if (diff > 0) arrSym = chalk.dim('\u25B4');       // up arrow
  else if (diff < 0) arrSym = chalk.dim('\u25BE');  // down arrow

  return arrSym;
}

// header
function header(moment, currencies) {
  let txt = chalk.bold.inverse(`${moment.format('DD/MM/YYYY')} `);
  for (const c of currencies) {
    txt += `\t${curTxt[c]}`;
  }
  txt += '\n';

  return txt;
}

// string: Bank   rate / rate....
function str(bank, currencies, rateObj) {
  let txt = bankTxt[bank];
  for (const c of currencies) {
    const rte = rateObj.find(r => r.bank === bank && r.ccy === c);
    if (!!rte) {
      txt += `${rte.buy.toFixed(3)}${arrow(rte.buydiff)}`;
      txt += (bank !== 'NBU') ? ` / ${rte.sale.toFixed(3)}${arrow(rte.salediff)}\t` : '\t\t\t';
    }
  }
  txt += '\n';

  return txt;
}

function footer(eurLimit, nbuRateObj) {
  let txt = chalk.dim('*Average BlackMarket rates are provided by minfin.com.ua');
  txt += '\n';

  if (!!nbuRateObj) {
    const eurUah = nbuRateObj.find(r => r.ccy === 'EUR').sale;
    const usdUah = nbuRateObj.find(r => r.ccy === 'USD').sale;
    const uahLimit = eurLimit * eurUah;

    txt += chalk.dim(`**According to NBU rates: ${eurLimit.toFixed(2)}\u20ac \u2248 ` +
      `${(uahLimit / usdUah).toFixed(2)}$ \u2248 ${uahLimit.toFixed(2)}\u20b4`);
    txt += '\n';
  }

  txt += chalk.dim('Check this project on GitHub: https://github.com/Molly101/curls.top');
  txt += '\n';

  return txt;
}

module.exports.header = header;
module.exports.str = str;
module.exports.footer = footer;

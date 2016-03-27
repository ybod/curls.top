'use strict';
const npmlog = require('npmlog');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

npmlog.stream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
npmlog.heading = moment().format('DD-MM-YYYY hh:mm:ss');

module.exports = npmlog;

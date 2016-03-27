const moment = require('moment');

const validate = require('validate.js');
validate.promise = require('bluebird');

validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse(value) {
    return moment.utc(value, 'YYYY-MM-DD').valueOf();
  },
  // Input is a unix timestamp
  format(value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});

validate.async.options = { format: 'flat', cleanAttributes: false };

module.exports = validate;

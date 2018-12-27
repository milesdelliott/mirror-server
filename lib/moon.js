const request = require('./request');
const moment = require('moment');

const moonRoute = `http://api.usno.navy.mil/moon/phase?date=${moment().subtract(10, 'days').format('M/D/YYYY')}&nump=4`;
const moonRequest = request(moonRoute)

module.exports = { moonRequest }
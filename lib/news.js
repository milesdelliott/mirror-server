const request = require('./request');
const { keys } = require('../config');

const newsRoute = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${keys.newYorkTimes}`;
const newsRequest = request(newsRoute)

module.exports = { newsRequest }
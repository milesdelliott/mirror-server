const { currentWeatherRequest, forecastRequest } = require('../lib/weather');
const url = require('url');
const { newsRequest } = require('../lib/news');

var createError = require('http-errors');

var lastNewsFetchTime = false;

var error = e => {
  console.log(e);
  createError('400');
};

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('weather');
  req.mirrorData = {};
  currentWeatherRequest(w => {
    req.mirrorData.currentWeather = w;
    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('forecast');
  forecastRequest(w => {
    req.mirrorData.forecast = w;

    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('news');
  const minute = 1000 * 60 * 60
  const now = new Date();
  console.log('news comparison', lastNewsFetchTime, now.getTime(), minute * 5)
  if (!lastNewsFetchTime || ((lastNewsFetchTime - now.getTime()) < (minute * 5) ) ) {
    console.log('news too soon!')
    next();
  }
  console.log('news is requesting')
  newsRequest(n => {
    req.mirrorData.news = n;
    newsFetch = now.getTime();
    req.mirrorData.newsFetch = 100
    next();
  })(e => {
    console.log(e);
    error(e);
  });
});

router.get('/', function(req, res, next) {
  console.log('respond');
 const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;
const forceRefreshKey = 0;
const dataInterval = 1800000;
console.log(dateTime)
  res.json({ data: req.mirrorData, forceRefreshKey, dataInterval });
});

module.exports = router;

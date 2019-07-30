const { currentWeatherRequest, forecastRequest } = require('../lib/weather');
const url = require('url');
const { newsRequest } = require('../lib/news');
const now = new Date();

var createError = require('http-errors');

var lastNewsFetchTime = false;
var newsData = false;
var error = e => {
  console.log(e);
  createError('400');
};

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  req.mirrorData = {};
  currentWeatherRequest(w => {
    req.mirrorData.currentWeather = w;
    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  forecastRequest(w => {
    req.mirrorData.forecast = w;
    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  newsRequest(n => {
    req.mirrorData.news = n;
    newsData = n;
    lastNewsFetchTime = now.getTime();
    req.mirrorData.newsFetch = 100
    next();
  })(e => {
    error(e);
    next();
  });
  
});

router.get('/', function(req, res, next) {
  const FORCE_REFRESH_KEY = 0;
  const DATA_INTERVAL = 1800000;
  res.json({ data: req.mirrorData, FORCE_REFRESH_KEY, DATA_INTERVAL });
});

module.exports = router;

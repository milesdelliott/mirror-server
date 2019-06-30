const { currentWeatherRequest, forecastRequest } = require('../lib/weather');
const url = require('url');
const { newsRequest } = require('../lib/news');
const { redditRequest } = require('../lib/reddit');
const { moonRequest } = require('../lib/moon');
const { colorRequest } = require('../lib/color');
const { calendarRequest } = require('../lib/calendar');

var createError = require('http-errors');

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

router.get('/w', function(req, res, next) {
  moonRequest(w => {
    if (!w.error) {
      req.mirrorData.moon = w.phasedata;
    }
    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('news');
  newsRequest(n => {
    req.mirrorData.news = n;

    next();
  })(e => {
    console.log(e);
    error(e);
  });
});

router.get('/', function(req, res, next) {
  console.log('color');
  colorRequest(n => {
    req.mirrorData.color = n;

    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('calendar');
  calendarRequest(n => {
    req.mirrorData.calendar = n;
    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('reddit');
  redditRequest(n => {
    req.mirrorData.reddit = n.data.children.filter(i => {
      const redditURL = url.parse(i.data.url);
      return !['v.redd.it', 'i.imgur.com', 'imgur.com', 'gfycat.com'].includes(
        redditURL.hostname
      );
    });

    next();
  })(e => error(e));
});

router.get('/', function(req, res, next) {
  console.log('respond');
 const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;
console.log(dateTime)
  res.json({ data: req.mirrorData });
});

module.exports = router;

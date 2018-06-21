const {currentWeatherRequest, forecastRequest} = require("../lib/weather");
const { newsRequest } = require("../lib/news");
var createError = require('http-errors');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.mirrorData = {}
    currentWeatherRequest(w => {
        req.mirrorData.currentWeather = w;
        next()
    })((e) => e)
});

router.get('/', function(req, res, next) {
    forecastRequest(w => {
        req.mirrorData.forecast = w;
        next()
    })(e => createError(400))
});

router.get('/', function(req, res, next) {
    newsRequest(n => {
        req.mirrorData.news = n;
        next()
    })(e => createError(400))
});

router.get('/', function(req, res, next) {
    res.json({data: req.mirrorData});
});

module.exports = router;

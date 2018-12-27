const request = require('./request');
const { keys } = require('../config');

const currentWeatherRoute = `http://api.openweathermap.org/data/2.5/weather?id=4487042&appid=${keys.openWeatherMap}&units=imperial`;
const forecastRoute = `http://api.openweathermap.org/data/2.5/forecast?id=4487042&appid=${keys.openWeatherMap}&units=imperial`;
const currentWeatherRequest = request(currentWeatherRoute)
const forecastRequest = request(forecastRoute)

module.exports = {currentWeatherRequest, forecastRequest }
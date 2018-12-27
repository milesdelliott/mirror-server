const request = require('./request');

const colorRoute = `http://www.colourlovers.com/api/palettes/top?format=json`;
const colorRequest = request(colorRoute)

module.exports = { colorRequest }
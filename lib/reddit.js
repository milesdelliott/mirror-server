const request = require('./request');
const { subreddit } = require('../config');


const redditRoute = `https://www.reddit.com/r/${subreddit}/top/.json?count=50&limit=50&t=week`;
const redditRequest = request(redditRoute)

module.exports = { redditRequest }
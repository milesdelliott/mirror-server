var express = require('express');
var router = express.Router();

const wrappedRouter = function(io) {
    router.post('/', function(req, res ) {
        console.log(req.body)
        const gesture = req.body.gesture
        io.sockets.emit("gesture", gesture);
        res.json(gesture);
    });
    return router;
}

module.exports = wrappedRouter;
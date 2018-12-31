var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('http://servad.local:3010/mirror/control.html');
});

module.exports = router;

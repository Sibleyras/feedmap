var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { edit: req.user ? req.user.editor : 0});
});

/* GET IP address. */
router.get('/ip', function(req, res, next) {
  res.send('Votre IP est ' + req.ip);
});

module.exports = router;

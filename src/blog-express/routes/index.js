var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get 就相当于blog1中的 if(method === 'GET')
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

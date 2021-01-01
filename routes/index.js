const express = require("express");
const router = express.Router();
const cookies = require("../helpers/cookies");

router.use(cookies.assignSID);

router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express is pretty pog!!!'});
});

module.exports = router;


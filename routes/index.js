const express = require("express");
const router = express.Router();
const pool = require("../app").pool;

router.get('/', async function (req, res, next) {
  let qResponse = await pool.query("SELECT * FROM games");
  res.render('index', {title: 'Express is pretty pog!!!', qResponse: JSON.stringify(qResponse)});
});

module.exports = router;

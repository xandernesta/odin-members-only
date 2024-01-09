var express = require('express');
var router = express.Router();
const {indexPage} = require("../controllers/indexController.js")

/* GET home page. */
router.get('/', indexPage);

module.exports = router;

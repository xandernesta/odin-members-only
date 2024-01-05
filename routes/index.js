var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Message = require("../models/message")

/* GET home page. */
router.get('/', asyncHandler(async function(req, res, next) {
  const allMessages = await Message.find({})
  .populate("author")
  .exec()

  res.render('index', { 
    title: 'MembersOnly',
    user: res.locals.currentUser,
    messages: allMessages,
  });
}));

module.exports = router;

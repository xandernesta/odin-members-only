const asyncHandler= require("express-async-handler")
const Message = require("../models/message")

//Export index Home Page
exports.indexPage = asyncHandler(async function(req, res, next) {
    const allMessages = await Message.find({})
    .sort({ createdAt: "descending" })
    .populate("author")
    .exec()
  
    res.render('index', { 
      title: 'MembersOnly',
      messages: allMessages,
    });
})
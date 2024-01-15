const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const Message = require("../models/message")

//Display New Message Form on GET
exports.message_form_get = asyncHandler(async function(req, res, next) {
     if (!req.user) {
        res.redirect("/login");
    } else { 
        res.render("message_form", {
            title: "New Message",
            msgTitle: undefined,
            msgText: undefined,
            errors: {},
            user: req.user,
        })
    }   
})

exports.message_form_post = [
    body("title")
    .trim()
    .isString()
    .withMessage("Only strings allowed in Title")
    .isLength({ min: 1 })
    .withMessage("Title is required"),
    body("msgText")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message text is required")
    .isLength({ max: 4000 })
    .withMessage("Message text cannot exceed 4000 characters."),

    asyncHandler(async function(req, res, next) {
        if (!req.user) {
            const err = new Error("User not logged in");
            err.status = 400;
            next(err);
      
            return;
        }
        const errors = validationResult(req);

        const message = new Message({
            title: req.body.title,
            message: req.body.msgText,
            author: req.user._id,
        });
        console.dir('message: '+ message)

        if (!errors.isEmpty()){
            res.render("message_form", {
                title: "New Message",
                msgTitle: message.title,
                msgText: message.message,
                errors: errors.array(),
                user: req.user,
            })
        } else {
            try {
                await message.save();
                res.redirect("/");
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }

}),]

//Display MESSAGE DELETE Confirmation page on GET
exports.message_delete_get = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id)
    .populate("author")
    .exec()

    if(message === null){
        //no results.
        const err = new Error("Candle not found")
        err.status = 404;
        return next(err);
    } else {
        res.render("message_delete",{
            title: "Delete Message Confirmation",
            message: message,
        })
    }
})

//Handle MESSAGE DELETE on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
    if(req.user.isAdmin !== true){
        const err = new Error("Unauthorized");
        err.status = 401;
        next(err);
    } else {
        await Message.findByIdAndDelete(req.body.messageid)
        res.redirect('/');
    }
})

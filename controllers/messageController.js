const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const Message = require("../models/message")

exports.message_form_get = asyncHandler(async function(req, res, next) {
    /* if (!req.user) {
        res.redirect("/login");
    } else { */
        res.render("message_form", {
            title: "New Message",
            msgTitle: undefined,
            msgText: undefined,
            errors: {},
            user: req.user,
        })
    // }   
})

exports.message_form_post = [
    body("title")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Title is required"),
    body("text")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Message text is required")
    .isLength({ max: 4 })
    .withMessage("Message text cannot exceed 4 characters."),

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
            message: req.body.text,
            author: req.user.id,
        });

        if (!errors.isEmpty()){
            res.render("message_form", {
                title: "New Message",
                msgTitle: message.title,
                msgText: message.message,
                errors: errors.array(),
                user: req.user,
            })
        } else {
            await message.save();

            res.redirect("/")
        }

})]
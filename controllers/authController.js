const User = require("../models/user")
const path = require("path")
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// for file uploads
const multer = require("multer");
// enable debug module logging
const debug = require("debug")("multer")
const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 6291456 //6MB
    }, 
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
  }).single('image');

/* Signup Form */

// Signup Form GET
exports.signup_form_get = asyncHandler(async (req, res, next) => {
    res.render("signup_form", {
        title: "Sign Up",
        username: undefined,
        email: undefined,
        image: undefined,
        password: undefined,
        confirmPassword: undefined,
        multerError: null,
        errors: null,
    })
})

// Signup Form POST
exports.signup_form_post = [
    (req, res, next) => {
        // Handle single file upload with field name "image"
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            debug('error on create Post, MulterError', err.message)
            } else if (err) {
            debug('error on create Post, UnhandledError', err.message)
            }
            if (err) {
            // Create a user object with escaped and trimmed data.
            const { username, email, image, password, confirmPassword } = req.body;
            res.render("signup_form",{
                title: "Sign Up",
                username: username,
                email: email,
                image: image,
                password: password,
                confirmPassword: confirmPassword,
                multerError: err.message,
            })
            } else {
                // upload is fine
                next()
            }
        })
    },
    asyncHandler(async (req, res, next) => {
        res.render("signup_form", {
            title: "Successful Prof Pic Sign Up",
            username: username,
            email: email,
            image: image,
            password: password,
            confirmPassword: confirmPassword,
            multerError: null,
            errors: null,
        })
})]
const User = require("../models/user")
var express = require('express');
var router = express.Router();
const indexPage = require("./indexController")
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

  /* Login Form */

// Login Form GET
exports.login_form_get = asyncHandler(async (req, res, next) => {
    if (res.locals.user) return res.redirect("/");
    res.render("login_form", {
        title: "Log In",
        messages: req.session.messages,
        errMsg: res.locals.message,
    })
})

// Login Form POST
exports.login_form_post = [

    // Authenticate user
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
      }),  
    ]
      

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
    body("username")
        .trim()
        .isString()
        .isLength({ min:1})
        .withMessage("Username is required")
        .isLength({ max: 28 })
        .withMessage("Username cannot be more than 28 characters")
        .custom((username) => {
            // alphanumeric and "_" non-consecutive
            const pattern = /^(?!.*__)[A-Za-z0-9_]+$/;
            return pattern.test(username);
        })
        .withMessage("Username can only contain alphanumeric and non-consecutive underscores")
        .custom(async (username) => {
            const usernameTaken = await User.isUsernameTaken(username);
            if (usernameTaken) return Promise.reject();
      
            return true;
          })
        .withMessage("Username is already taken"),
    body("password")
        .isLength({ min: 6})
        .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
        .custom((confirmPass, { req }) =>{
           return req.body.password === confirmPass
        })
        .withMessage("Passwords do not match!"),
    asyncHandler(async (req, res, next) => {
        // check for errors
        const errors = validationResult(req)

        const { username, email, image, password, confirmPassword } = req.body;

        if (!errors.isEmpty()){
            res.render("signup_form", {
                title: "Sign Up",
                username: username,
                email: email,
                image: image,
                password: password,
                confirmPassword: confirmPassword,
                multerError: null,
                errors: errors.array(),
            })
        } else {
            //no validation errors
            //hash the password with bcryptjs
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) reject(err);
                    else resolve(hash)
                })
            }) 

            const user = new User({
                username,
                email,
                image: req.file ? req.file.filename : null,
                password: hashedPassword,
                status: "member",
            });
            await user.save();

            next();
        }
    }),
    // Authenticate user
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/signup", 
        failureMessage: true, 
    }),
    
]


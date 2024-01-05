// Load .env file if server is not in production mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const expressLayouts = require("express-ejs-layouts");
const helmet = require("helmet")

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
const signUpRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const messageRouter = require('./routes/message')

var app = express();

// Setup mongoDB connection with mongoose
//mongoose connection
/* mongoose.set("strictQuery, false"); */
const mongoDB = process.env.MONGODB_URI
//error catching for connection
main().catch((err)=> console.log(err))
async function main(){
  await mongoose.connect(mongoDB)
}

// enabling the Helmet middleware
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "*.w3.org","code.jquery.com", "cdn.jsdelivr.net" ],
      "font-src": ["'self'", "external-website.com"],
      // allowing styles from any website
      "style-src": ["'self'", "'unsafe-inline'",'https://cdnjs.cloudflare.com/ajax/'],
      "font-src": ["'self'",'https://cdnjs.cloudflare.com/ajax/'],
    },
    reportOnly: true,
}))
// overriding "font-src" and "style-src" while
// maintaining the other default values

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
// passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
// Setup passport LocalStrategy - must be above passport.initialize()
// Function to lookup user in our database and allow authentication if found (called by passport)
passport.use(
  new LocalStrategy(async (username, password, done) => {
      try {
          const user = await User.findOne({ username: username})
          if(!user) {
              return done(null, false, { message: "Incorrect username" })
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
          }
          // Everything looks good return user
          return done(null, user)
      } catch (err) {
          return done(err)
      }
  })
)
// Session functions to allow users to stay logged in while navigating the app by creating user cookie and storing in browser (called by passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // from another repo to track local membership status
  res.locals.isMember = req.user && req.user.status !== "non-member";
  res.locals.currentPath = req.path;
  next();
});

app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/signup', signUpRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/message', messageRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

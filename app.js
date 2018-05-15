var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var cors = require('cors');


var index = require('./routes/index');
var users = require('./routes/users');
var forts = require('./routes/forts');
var auth = require('./routes/auth');

var app = express();

// view engine setup
passport.use(new GoogleStrategy({
  clientID: '922526804695-hri0d8g95vl6qlq9jav91d0b3i6dttg3.apps.googleusercontent.com',
  clientSecret: 'CYx2JBl7tU8DrUI9ZeE04hlW',
  callbackURL: 'http://localhost:3001/auth/google/callback'
},
  function (req, accessToken, refreshToken, profile, done) {
    done(null, profile)
  }
))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors()
);

app.use(express.static(path.join(__dirname, 'public')));


require('./config/passport')(app);

app.use(session({
  secret: 'anything', resave: false,
  saveUninitialized: false
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

app.use('/', index);
app.use('/users', users);
app.use('/forts', forts);
app.use('/auth', auth)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;

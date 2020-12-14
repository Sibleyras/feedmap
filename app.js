const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');

var models = require('./models/index')(config)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')(models, passport);
var infosRouter = require('./routes/infos')(models);

var app = express();

// Set LocalStrategy for authentication.
passport.use(new LocalStrategy(
  function (username, password, done) {
    return models['User'].checkPassword(username, password, done);
  }
));

// Passport authenticate session.
passport.serializeUser(function (user, done) {
  return done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
  await models['User'].findByUsername(username, function (err, user) {
    if (err)
      return done(err);
    return done(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.secret4cookie,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', usersRouter);
app.use('/infos', infosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
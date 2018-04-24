var createError = require('http-errors');
var express = require('express');
var csrf = require('csurf');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var helpers = require('handlebars-helpers')();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

var app = express();
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/auction');
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
Handlebars.registerHelper('if_equal', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret: 'mysupersecret',
	resave: false,
  saveUnitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});


app.use('/product',productsRouter);
app.use('/user', usersRouter);
app.use('/', indexRouter);


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

app.get('/posts', function (req, res, next) {
  res.render('/product/index', {
      paginator: {
          limit: 10, // This key:value pair is required.
          defaultPage: 'posts', // This key:value pair defaults to 'posts' if not set.
          currentPage: req.params.page, // This key:value pair is required.
          totalPages: 20, // This key:value pair is required.
      }
  });
});

app.get('/posts/:page', function(req, res, next) {
  res.render('/product/index', {
      paginator: {
          limit: 10, // This key:value pair is required.
          defaultPage: 'posts', // This key:value pair defaults to 'posts' if not set.
          currentPage: req.params.page, // This key:value pair is required.
          totalPages: 20, // This key:value pair is required.
      }
  });
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var debug = require('debug')('nodejs-project:app');
var connectMongo = require('connect-mongo');
var passport = require('passport');

var MongoStore = connectMongo(session);
var sessConnStr = "mongodb://localhost/project_sessions";
var sessionConnect = mongoose.createConnection();
sessionConnect.on('connecting', function() { debug('Connecting to MongoDB: '); });
sessionConnect.on('connected', function() { debug('Connected to MongoDB: '); });
sessionConnect.on('disconnecting', function() { debug('Disconnecting to MongoDB: '); });
sessionConnect.on('disconnected', function() { debug('Disconnected to MongoDB: '); });
sessionConnect.on('reconnected', function() { debug('Reconnected to MongoDB: '); });
sessionConnect.on('error', function(err) { debug('Error to MongoDB: ' + err); });
sessionConnect.on('open', function() { debug('MongoDB open : '); });
sessionConnect.on('close', function() { debug('MongoDB close: '); });
process.on('SIGINT', function() { sessionConnect.close(function () { process.exit(0); });});
sessionConnect.open(sessConnStr);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'ejs_templates'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/client_app', express.static(path.join(__dirname, 'client_app')));

app.use(session({
    name: 'myapp.sid',
    secret: "my special secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new MongoStore({ mongooseConnection: sessionConnect }),
    cookie: { maxAge: 3600000, httpOnly: true, sameSite: true }
}));

app.use(passport.initialize());
app.use(passport.session());

var root = require('./routes/root');
var login = require('./routes/loginRoute')
var users = require('./routes/usersRoute');
var messages = require('./routes/messagesRoute');

app.use('/', root);
app.use('/login', login);
app.use('/users', users);
app.use('/messages', messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

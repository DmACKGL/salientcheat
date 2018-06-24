var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var Raven = require('raven');
var minify = require('express-minify');
var cache = require('memory-cache');
var compression = require('compression')
var index = require('./routes/index');
var confesiones = require('./routes/game');
var app = express();
const auth = require('http-auth');
const basic = auth.basic({
  realm: 'Area Monitoreo'
}, function(user, pass, callback) {
  callback(user === 'Salient' && pass === '####');
});

Raven.config(process.env.RAVEN).install();
app.use(Raven.requestHandler());

app.use(compression());
app.use(minify());

// Rates
app.enable('trust proxy');

const statusMonitor = require('express-status-monitor')({
  path: ''
});
app.use(statusMonitor.middleware);
app.get('/status', auth.connect(basic), statusMonitor.pageRoute);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
});

app.use('/', index);
app.use('/api/v1/game', confesiones);

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
  res.end(res.sentry + '\n');
});


module.exports = app;
var server = http.createServer(app);
server.listen(5565);

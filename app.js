
/**
 * Module dependencies.
 */

var express = require('express'),
    webRoutes = require('./routes/web'),
    apiRoutes = require('./routes/api'),
    // user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler');

var app = express();
var env = process.env.NODE_ENV || 'development';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (env == 'development') app.use(errorHandler());


app.use(function(req, res, next){
  console.log('middleware');
  next();
});

// ROUTES //

// app.get('/users', user.list);  //TEST

var webRouter = express.Router();
    webRouter
      .get('/', webRoutes.index)
      .get('/kontakt', webRoutes.contact)
      .get('/katalog', webRoutes.catalog);

var apiRouter = express.Router();
    apiRouter
      .get('/', apiRoutes.index);

app.use('/', webRouter);
app.use('/api', apiRouter);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

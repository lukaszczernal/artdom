

// MODULE DEPENDENCIES

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

    
// DATABASE DEPENDENCIES

var configDB    = require('./config/database.js'),
    populateDB  = require('./data/initData.js'),
    mongo       = require('mongodb'),
    mongoose    = require('mongoose');

    mongoose.connect(configDB.url);

var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function() {
      console.log('db: connected');
    });

// DATABASE SETUP

var hashSchema = mongoose.Schema({
  hash: String
});

var Hash = mongoose.model('hash', hashSchema);

// APP START

var app = express();
var env = process.env.NODE_ENV || 'development';


// ALL ENVIRONMENTS

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  req.db = db;
  next();
});

if (env == 'development') app.use(errorHandler());

// ROUTES //

var webRouter = express.Router();
    webRouter
      .param('hash', function(req, res, next, urlHash){
        Hash.findOne({hash: urlHash}, function (err, hashDoc) {
          req.isValidHash = (!!err || !!hashDoc)? true : false;
          next();
        });
      })
      .get('/', webRoutes.index)
      .get('/kontakt', webRoutes.contact)
      .get('/katalog', webRoutes.catalog)
      .get('/katalog/:hash', webRoutes.catalog)
      .get('/populate-db', function(req, res) {
        populateDB.hashes(arguments);
      });

var apiRouter = express.Router();
    apiRouter
      .get('/', apiRoutes.index);

app.use('/', webRouter);
app.use('/api', apiRouter);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

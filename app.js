var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var paramCheck = require('./middle/paramCheck');
var respone = require('./middle/respone').respone();

var api = require('./routes/api');
var manager = require('./routes/manager');
var adminSetting = require('./routes/adminSetting');
//var users = require('./routes/users');

var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req, res, next) {
	
	paramCheck.ParamCheck(req.body, function(isCheck) {
		
		if(isCheck) { //Param 값 있음
			paramCheck.ParamIsVal(req.body.param,function(isJson, key) {
				
				if(isJson) //Json 값 전부 있음
				{
					
					next();
				}
				else //Json 값 Null 존재
				{
					respone.setRespone(1, "null Param Key : " + key);
					res.send(respone.getRespone());
					

				}
			});
		}
		else { //Param Null
			respone.setRespone(1, "null Param Data ");
			res.send(respone.getRespone());
		}
	});

});

app.use('/api', api);
app.use('/manager', manager);
app.use('/adminSetting',adminSetting);
//app.use('/users', users);

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

#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./db')
var routes = require('./routes')(db);
var user = require('./routes/user');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "Marusya",
	key: "NODESESSID",
	cookie: {
			"path": "/",
			"maxAge": null,
			"httpOnly": true
		},
}));
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.slash);
app.get('/login', routes.login);
app.post('/login', routes.postLogin);
app.get('/logout', routes.logout);
app.get('/register', routes.register);
app.put('/register:name', routes.putRegister);
app.post('/register', routes.postRegister);
app.get('/main', routes.main);
app.post('/main', routes.postNote);
app.put('/main:id/delete', routes.deleteNote);
app.post('/mainedit', routes.editNote);

// development only

app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});



if ('development' == app.get('env')) {
 	app.use(function(err, req, res, next){
 		res.status(err.status || 500);
 		res.render('error', {
 			message: err.message,
 			error: err,
 			title: 'Ошибка'
 		});
 	});
}

app.use(function(err, req, res, next){
 		res.status(err.status || 500);
 		res.render('error', {
 			message: err.message,
 			error: {},
 			title: 'Ошибка'
 		});
 	});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

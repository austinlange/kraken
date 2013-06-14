var events = require('events');
var express = require('express');
var util = require('util');

var path = require('path');

var routes = require('../routes');

var Kraken = function(options) {
	//console.log("routes" + routes);
	options = options || {};
	
	this.http = express();
	this.http.set(express.compress());
	this.http.set('views', __dirname + '../../views');
	this.http.set('view engine', 'hbs');
	this.http.use(express.favicon());
	this.http.use(express.logger('dev'));
	this.http.use(this.http.router);
	this.http.use(express.static(path.join(__dirname, '../public')));

	
	this.http.get('/', routes.index);
	this.http.get('/admin', routes.admin);
	this.http.get('/admin/dashboard', routes.dashboard);
	
	//this.http.get('/api/1/user', routes.user)
	
	
	this.http.listen(3000);

	events.EventEmitter.call(this);
};

util.inherits(Kraken, events.EventEmitter);

Kraken.prototype.test = function(string) {
	console.log(string)
};

Kraken.prototype.openDatabase = function() {
	//this db
	this.emit("connectedToDatabase");
};

module.exports = Kraken;
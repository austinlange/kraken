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
	
	var port = process.env.PORT || 3000;
	this.http.listen(port, function() {
		console.log("Listening on port " + port);	
	});

	events.EventEmitter.call(this);
};

util.inherits(Kraken, events.EventEmitter);

Kraken.prototype.test = function(string) {
	console.log(string)
};

Kraken.prototype.openDatabase = function() {
	//this db
	console.log("Connecting to redis: " + process.env.REDISTOGO_URL);
	try {
		this.db = require('redis-url').connect(process.env.REDISTOGO_URL);
	} catch(e) {
		console.log("Caught: " + e);
	}
	this.db.set("sam is", "gay");

	this.emit("connectedToDatabase");
};

module.exports = Kraken;
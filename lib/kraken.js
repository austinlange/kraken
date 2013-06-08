var events = require('events');
var express = require('express');
var util = require('util');
//var hapi = require('hapi');

var Kraken = function(options) {
	options = options || {};

	//this.http_options = {};
	//this.http = hapi.createServer('localhost', 3000);
	
	this.http = express();
	this.http.use(express.directory(__dirname+'/public'));
	this.http.use(express.static(__dirname+'/public'));
	this.http.get('/hello', function(req, res) {
		var body = 'Hello World';
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Content-Length', body.length);
		res.end(body);
	});
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
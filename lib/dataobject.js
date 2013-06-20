var Redis = require('./db');

var DataObject = function(options) {
	options = options || {};

	this.hashPrefix = options.hashPrefix || "";
	this.validFields = options.validFields || [];

	this.client = Redis.client;
}

DataObject.prototype.create = function(options, callback) {
	console.log(options);

	var fieldList = [];

	var key = this.hashPrefix + ':';
	var commandArgs = [key];
	
	this.client.incr(this.hashPrefix + ".next", (function(error, value) {
		if (error) {
			console.log("Error: " + error);
			return;
		}

		console.log("New id: " + value);
		key += value;
	
		for (field in options) {
			if (this.validFields.indexOf(field) != -1) {
				commandArgs.push(field);
				commandArgs.push(options[field]);
			}
		}
		
		console.log(commandArgs);
		this.client.hmset(commandArgs, function(error) {
			if(error) {
				console.log(error);
			}
		});

	}).bind(this));
}

module.exports = DataObject;
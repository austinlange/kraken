var Redis = require('./db');

var DataObject = function(options) {
	options = options || {};

	this.hashPrefix = options.hashPrefix || "";
	this.validFields = options.validFields || {};

	this.client = Redis.client;
}

DataObject.prototype.loadById = function(id, callback) {
	if (!id) {
		return callback(new Error("Invalid argument: id"));
	}

	var commandArgs = [this.hashPrefix + ":" + id];
	var properties = {};

	this.client.hgetall(commandArgs, (function(error, value) {
		if (error) {
			return callback(new Error("Database error"));
		}

		if (!value || value.length == 0) {
			return callback(new Error("No fields returned for key"));
		}

		for (var field in this.validFields) {
			switch (field.type) {
				case "Number":
					if (!isNaN(Number(value[field]))) {
						this[field] = Number(value[field]) || 0;
					}
					break;
				case "String":
				default:
					this[field] = value[field] || "";
					break;
			}
		}

		this.id = id;

		return callback(null, value);
	}).bind(this));
};

DataObject.prototype.exists = function(id, callback) {
	if (!id) {
		return callback(new Error("Invalid argument: id"));
	}

	this.client.hlen(this.hashPrefix + ":" + id, function(error, value) {
		if (error) {
			return callback(error);
		}

		return callback(null, value > 0);
	});
}

DataObject.prototype.persist = function(callback) {
	if (!this.id) {
		return callback(new Error("No ID provided to DataObject"));
	}

	var commandArgs = [this.hashPrefix + ":" + this.id];

	for (var field in this.validFields) {
		commandArgs.push(field);
		commandArgs.push(this[field]);
	}
	
	this.client.hmset(commandArgs, function(error, value) {
		if(error) {
			console.log(error);
			return;
		}

		return callback(null, value);
	});
}

module.exports = DataObject;
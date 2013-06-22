var Redis = require('./db');

var DataObject = function(options) {
	options = options || {};

	this.hashPrefix = options.hashPrefix || "";
	this.validFields = options.validFields || [];

	this.client = Redis.client;
}

DataObject.prototype.loadById = function(id, callback) {
	if (!id) {
		return callback(new Error("Invalid argument: id"));
	}

	var commandArgs = [this.hashPrefix + ":" + id];
	var properties = {};

	this.client.hgetall(commandArgs, function(error, value) {
		if (error) {
			return callback(new Error("Database error"));
		}

		if (!value || value.length == 0) {
			return callback(new Error("No fields returned for key"));
		}

		value.id = id;

		return callback(null, value);
	});
};

DataObject.prototype.exists = function(id, callback) {
	if (!id) {
		return callback(new Error("Invalid argument: id"));
	}

	this.client.hlen(this.hashPrefix + ":" + id, function(error, value) {
		if (error) {
			return callback(error);
		}

		return callback(null, value);
	});
}

DataObject.prototype.create = function(id, options, callback) {
	options = options || {};

	if (!id) {
		return callback(new Error("No ID provided to DataObject"));
	}

	var fieldList = [];
	var commandArgs = [this.hashPrefix + ":" + id];
	
	this.exists(id, (function(error, value) {
		if (error) {
			return callback(error);
		}

		if (value == 0) {
			for (field in options) {
				if (this.validFields.indexOf(field) != -1) {
					commandArgs.push(field);
					commandArgs.push(options[field]);
				}
			}
			
			this.client.hmset(commandArgs, function(error, value) {
				if(error) {
					console.log(error);
					return;
				}

				return callback(null, value);
			});
		} else {
			return callback(new Error("ID exists"));
		}

	}).bind(this));

}

module.exports = DataObject;
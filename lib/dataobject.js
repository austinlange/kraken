var Redis = require('./db');
var Postgre = require('./pg');
var util = require('util');

var DataObject = function(options) {
	options = options || {};

	if (!options.tableName) {
		throw new Error("No tablename specified");
	}

	this.tableName = options.tableName;
	this.validFields = options.validFields || {};

	this.client = Postgre.client;
}

DataObject.prototype.getId = function() { return this.id; };

DataObject.prototype.loadById = function(id, callback) {
	if (!id || isNaN(id)) {
		return callback(new Error("Invalid argument: id"));
	}

	this.loadByField('id', id, (function(error) {
		if (error) {
			return callback(error);
		}

		return callback();
	}).bind(this));
};

DataObject.prototype.loadByField = function(field, value, callback) {
	if (!field || !value) {
		return callback(new Error("Invalid argument: field or value is null"));
	}

	var query = util.format("SELECT * FROM %s WHERE %s = $1", this.tableName, field);

	this.client.query(query, (util.isArray(value) ? value : [value]), (function(error, result) {
		if (error) {
			return callback(error);
		}

		for (var field in this.validFields) {
			switch (field.type) {
				case "Number":
					if (!isNaN(Number(result[field]))) {
						this[field] = Number(result.rows[0][field]) || 0;
					}
					break;
				case "String":
				default:
					this[field] = result.rows[0][field] || "";
					break;
			}
		}

		this.id = Number(result.rows[0].id);

		return callback(null);
	}).bind(this));
};

DataObject.create = function(object, options, callback) {

	var newObject = new object();
	var fieldList = Object.keys(newObject.validFields);
	var valueList = [];

	for (var field in newObject.validFields) {
		valueList.push("'" + options[field] + "'" || "");
	}

	valueList.push('DEFAULT');
	fieldList.push('id');

	var fieldString = fieldList.join(',');

	var query = util.format("INSERT INTO %s (%s) VALUES (%s) RETURNING %s", newObject.tableName, fieldString, valueList.join(","), fieldString);
	console.log("CREATE query: %s", query);

	Postgre.client.query(query, (function(error, result) {
		if (error) {
			return callback(error);
		}

		for (var field in newObject.validFields) {
			newObject[field] = result.rows[0][field];
		}

		newObject.id = result.rows[0].id;

		console.log("Created id %d", newObject.id);

		return callback(null, newObject);
	}).bind(this));
};

DataObject.prototype.update = function(callback) {
	if (!this.id || isNaN(this.id)) {
		return callback(new Error("No ID field provided to DataObject"));
	}

	var fieldList = [];
	var valueList = [];
	var valuePairs = [];

	var i = 1;
	for (var field in this.validFields) {
		valuePairs.push(util.format("%s = $%d", field, i++));
		valueList.push(this[field] || "");
		fieldList.push(field);
	}

	var query = util.format("UPDATE %s SET %s WHERE id = %d RETURNING %s", this.tableName, valuePairs.join(", "), this.id, fieldList.join(", "));

	console.log("UPDATE query: %s", query);

	this.client.query(query, valueList, (function(error, result) {
		if (error) {
			return callback(error);
		}

		return callback(null, result);
	}).bind(this));
};

module.exports = DataObject;
var DataObject = require('./dataobject');
var util = require('util');
var crypto = require('crypto');

var User = module.exports = function() {
	var options = {};
	options.hashPrefix = 'user';
	options.validFields = {
		'fname': true,
		'lname': true,
		'email': true,
		'password': true
	};

	DataObject.call(this, options);
};

util.inherits(User, DataObject);

User.prototype.loadById = function(email, callback) {
	console.log("Loading user id " + email);

	DataObject.prototype.loadById.call(this, email, (function(error) {
		if (error) {
			return callback(error);
		}

		return callback(null);
	}).bind(this));
};

User.prototype.create = function(options, callback) {
	
	if (!options || !options.email) {
		return callback(new Error("No email defined for user"));
	}

	if (!options || !options.password) {
		return callback(new Error("No password defined for user"));
	}

	console.log("Creating user id " + options.email);

	this.id = options.email;
	this.email = options.email;
	this.password = new Buffer(crypto.createHash('sha256').update(options.password).digest('hex')).toString('base64');
	this.fname = options.fname || "";
	this.lname = options.lname || "";

	DataObject.prototype.persist.call(this, callback);
};

User.prototype.checkPassword = function(password, callback) {
	var hashedPassword = crypto.createHash('sha256').update(password).digest('base64');
	return this.password == hashedPassword;
}

User.prototype.toJSON = function() {
	var json = {};

	json.id = this.id;
	json.fname = this.fname;
	json.lname = this.lname;
	json.email = this.email;

	return json;
};


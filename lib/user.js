var DataObject = require('./dataobject');
var util = require('util');
var crypto = require('crypto');

var User = module.exports = function() {
	var options = {};
	options.tableName = 'users';
	options.validFields = {
		'fname': true,
		'lname': true,
		'email': true,
		'password': true
	};

	DataObject.call(this, options);
};

util.inherits(User, DataObject);

User.prototype.loadById = function(id, callback) {
	console.log("Loading user id " + id);

	DataObject.prototype.loadById.call(this, id, (function(error) {
		if (error) {
			return callback(error);
		}

		return callback(null);
	}).bind(this));
};

User.prototype.loadByEmail = function(email, callback) {
	console.log("Loading user by email: %s", email);
	DataObject.prototype.loadByField.call(this, 'email', email, callback);
};

User.create = function(options, callback) {
	
	if (!options || !options.email) {
		return callback(new Error("No email defined for user"));
	}

	if (!options || !options.password) {
		return callback(new Error("No password defined for user"));
	}

	console.log("Creating user with email " + options.email);

	options.password = new Buffer(crypto.createHash('sha256').update(options.password).digest('hex')).toString('base64');

	DataObject.create.call(this, User, options, (function(error, user) {
		if (error) {
			if (error.code == '23505') {
				return callback(new Error(util.format("User email %s already exists", options.email)));
			} else {
				return callback(new Error("Error creating user: " + error.detail));
			}
		}

		return callback(null, user);
	}).bind(this));
};

User.prototype.update = function(callback) {
	
	console.log("Updating user id " + this.getId());

	DataObject.prototype.update.call(this, function(error, result) {
		if (error) {
			return callback(new Error("Error updating user: " + error.detail));
		}

		return callback(null, result.rowCount != 0);
	});
};

User.prototype.changePassword = function(oldPassword, newPassword, callback) {
	if (this.checkPassword(oldPassword)) {
		this.password = new Buffer(crypto.createHash('sha256').update(newPassword).digest('hex')).toString('base64');

		DataObject.prototype.persist.call(this, callback);
	}
};

User.prototype.checkPassword = function(password) {
	var hashedPassword = crypto.createHash('sha256').update(password).digest('base64');
	return this.password == hashedPassword;
};

User.prototype.toJSON = function() {
	var json = {};

	json.id = this.id;
	json.fname = this.fname;
	json.lname = this.lname;
	json.email = this.email;

	return json;
};


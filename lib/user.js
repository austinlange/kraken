var DataObject = require('./dataobject');
var util = require('util');

var User = module.exports = function() {
	var options = {};
	options.hashPrefix = 'user';
	options.validFields = [
		'name',
		'email'
	];

	DataObject.call(this, options);
};

util.inherits(User, DataObject);

User.prototype.loadById = function(email, callback) {
	console.log("Loading user id " + email);

	DataObject.prototype.loadById.call(this, email, callback);
};

User.prototype.create = function(email, options, callback) {
	console.log("Creating user id " + email);

	DataObject.prototype.create.call(this, email, options, callback);
};


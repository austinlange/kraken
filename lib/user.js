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

User.prototype.create = function(options, callback) {
	DataObject.prototype.create.call(this, options, callback);
};

util.inherits(User, DataObject);
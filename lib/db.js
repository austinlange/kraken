process.env.REDISTOGO_URL = process.env.REDISTOGO_URL || "redis://localhost:6379";

var redis = require('redis-url');

var RedisDB = function() {

};

RedisDB.prototype.open = function() {
	console.log("trying to open redis: " + process.env.REDISTOGO_URL);
	if (process.env.REDISTOGO_URL) {
		this.client = redis.connect(process.env.REDISTOGO_URL);
	}
};

RedisDB.prototype.close = function() {
	this.client.end();
};

module.exports = new RedisDB;
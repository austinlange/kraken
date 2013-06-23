process.env.HEROKU_POSTGRESQL_AMBER_URL = process.env.HEROKU_POSTGRESQL_AMBER_URL || "postgres://postgres:clockwork@localhost:5432/kraken";
var PG = require('pg');

var Postgre = function() {

}

Postgre.prototype.open = function(callback) {
	console.log("Connecting to " + process.env.HEROKU_POSTGRESQL_AMBER_URL);
	PG.connect(process.env.HEROKU_POSTGRESQL_AMBER_URL, (function(error, client) {
		if (error) {
			return callback(error);
		}

		this.client = client;

		return callback(null);
	}).bind(this));
}

module.exports = new Postgre();
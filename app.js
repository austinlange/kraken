
var KRAKEN = require('./lib/kraken');
var Kraken = new KRAKEN({});
var User = require('./lib/user');

Kraken.on("connectedToDatabase", (function() {
	if(!this.db) {
		console.log("Error: no DB");
		return;
	}

	console.log("Connected to db");

	var austin = new User();
	austin.create({
		"name": "Austin",
		"email": "austin.lange@gmail.com"
	}, (function(error, value) {

	}).bind(this));
	
}).bind(Kraken));

Kraken.openDatabase();

// bind process events to the app
//process.on("exit", (Kraken.onProcessExit).bind(tos));
//process.on("uncaughtException", (Kraken.handleCriticalError).bind(tos));
//process.on("SIGINT", (Kraken.shutdown).bind(tos));
//process.on("SIGTERM", (Kraken.shutdown).bind(tos));

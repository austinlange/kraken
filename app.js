
var KRAKEN = require('./lib/kraken');
var Kraken = new KRAKEN({});

Kraken.on("connectedToDatabase", (function() {
	if(!this.db) {
		console.log("Error: no DB");
		return;
	}

	console.log("Connected to db");
	this.db.get("sam is", function(error, value) {
		if(error) {
			console.log("Error: " + error);
			return;
		}
		console.log("sam is: " + value); 
	});
	
}).bind(Kraken));

Kraken.openDatabase();

// bind process events to the app
//process.on("exit", (Kraken.onProcessExit).bind(tos));
//process.on("uncaughtException", (Kraken.handleCriticalError).bind(tos));
//process.on("SIGINT", (Kraken.shutdown).bind(tos));
//process.on("SIGTERM", (Kraken.shutdown).bind(tos));

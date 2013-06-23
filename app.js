
var KRAKEN = require('./lib/kraken');
var Kraken = new KRAKEN({});
var User = require('./lib/user');

Kraken.on("connectedToDatabase", (function(error) {
	if (error) {
		console.log(error);
		return;
	}

	console.log("Connected to db");

	var user = new User();
	user.loadByEmail('austin.lange@gmail.com', (function(error) {
		if (error) {
			return console.log(error);
		}

		user.lname = 'Lange';
		user.fname = 'Austin';

		user.update(function(error) {
			console.log("[%d] %s %s <%s>", user.id, user.fname, user.lname, user.email);		
		});

	}).bind(this));

	var sam;
	User.create({
		'email': 'sam.kelly.developer@gmail.com',
		'fname': 'sam',
		'lname': 'kelly',
		'password': 'password'
	}, (function(error, user) {
		if (error) {
			return console.log(error);
		}

		sam = user;

		return console.log("[%d] %s %s <%s>", sam.id, sam.fname, sam.lname, sam.email);
	}).bind(this));

}).bind(Kraken));

Kraken.openDatabase();

// bind process events to the app
//process.on("exit", (Kraken.onProcessExit).bind(tos));
//process.on("uncaughtException", (Kraken.handleCriticalError).bind(tos));
//process.on("SIGINT", (Kraken.shutdown).bind(tos));
//process.on("SIGTERM", (Kraken.shutdown).bind(tos));

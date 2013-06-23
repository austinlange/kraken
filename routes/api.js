var User = require('../lib/user');

module.exports = function(app) {
	var sendError = function(message, response) {
		return response.json(200, {"success": false, "error": message});
	};

	var sendSuccess = function(data, response) {
		return response.json(200, {"success": true, "data": data});
	};

	var sendObject = function(object, response) {
		return response.json(200, object);
	};

	app.post("/api/:version/user/:id", function(request, response, next) {
		if (!request.params.id) {
			return sendError("Missing required argument ID", response);
		}

		console.log("Updating " + request.params.id);

		var user = new User();

		var func = isNaN(request.params.id) ? user.loadByEmail : user.loadById;

		func.call(user, request.params.id, (function(error) {
			if (isNaN(user.id) || !user.id) {
				return sendError("User does not exist", response);
			}

			user.fname = request.body.fname || user.fname;
			user.lname = request.body.lname || user.lname;

			user.update((function(error) {
				if (error) {
					return sendError(error, response);
				}

				return sendObject(user.toJSON(), response);
			}).bind(this));

		}).bind(this));
	});

	app.post("/api/:version/user", function(request, response, next) {
		var missingFields = [];

		if (!request.body.email) {
			missingFields.push("email");
		}

		if (!request.body.password) {
			missingFields.push("password");
		}

		if (missingFields.length > 0) {
			return sendError("Missing fields: " + missingFields.join(', '), response);
		} 

		User.create(request.body, (function(error, user) {
			if (error) {
				console.log("Error creating user: " + error);
				return sendError("Error creating user: " + error, response);
			}

			return sendObject(user, response);
		}).bind(this));
	});

	app.get("/api/:version/user/:id", function(request, response, next) {
		if (!request.params.id) {
			return sendError("Missing required parameter 'id'");
		}

		var user = new User();

		var respond = (function(error) {
			if (error) {
				return sendError(error, response);
			}

			return sendObject(user, response);
		}).bind(this);

		if (isNaN(request.params.id)) {
			console.log("Looking up user by email: %s", request.params.id);
			user.loadByEmail(request.params.id, respond);
		} else {
			console.log("Looking up user by ID: %d", request.params.id);
			user.loadById(request.params.id, respond);
		}
	});

	// 404 everything else
    app.all(/^\/api\/.*/, function(request, response, next) { 
		console.log(request.method.toUpperCase() + " 404: " + request.url);
		
		response.statusCode = 404;
		response.contentType("json");
		response.send({"error": "The requested resource was not found."});
	});
}
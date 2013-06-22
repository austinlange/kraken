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

		user.loadById(request.params.id, (function(error) {
			if (!user.id) {
				return sendError("User does not exist", response);
			}

			user.fname = request.body.fname || user.fname;
			user.lname = request.body.lname || user.lname;
			
			user.persist((function(error) {
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

		if (missingFields.length > 0) {
			return sendError("Missing fields: " + missingFields.join(','), response);
		}

		var user = new User();
		user.exists(request.body.email, (function(error, exists) {
			if (error) {
				return sendError(error, response);
			}

			if (!exists) {
				user.create(request.body, (function(error, value) {
					if (error) {
						return sendError(error, response);
					}

					if (value == 0) {
						return sendError("Failed to create user", response);
					} else {
						return sendSuccess("User successfully created", response);
					}
				}).bind(this));
			} else {
				return sendError("User already exists", response);
			}

		}).bind(this));
	});

	app.get("/api/:version/user/:id", function(request, response, next) {
		if (!request.params.id) {
			return sendError("Missing required parameter 'id'");
		}

		var user = new User();

		user.loadById(request.params.id, (function(error) {
			if (error) {
				return sendError(error, response);
			}

			return sendObject(user, response);
		}).bind(this));
	});

	// 404 everything else
    app.all(/^\/api\/.*/, function(request, response, next) { 
		console.log(request.method.toUpperCase() + " 404: " + request.url);
		
		response.statusCode = 404;
		response.contentType("json");
		response.send({"error": "The requested resource was not found."});
	});
}
var User = require('../lib/user');

module.exports = function(app) {
	var buildResponse = function(success, body) {
		return {
			success: success,
			data: body
		};
	};

	app.post("/api/:version/user", function(request, response, next) {
		var missingFields = [];
		console.log("POST fields: ");
		console.log(request.body);

		if (!request.body.name) {
			missingFields.push("name");
		}

		if (!request.body.email) {
			missingFields.push("email");
		}

		if (missingFields.length > 0) {
			return response.json(200, {"success": false, "error": "Missing fields: " + missingFields.join(',')});
		}

		var user = new User();
		user.create(request.body.email, request.body, function(error, value) {
			if (error) {
				return response.json(200, {"success": false, "error": error});
			}

			if (value == 0) {
				return response.json(200, {"success": false, "error": "Failed to create user"});
			} else {
				return response.json(200, {"success": true, "message": "User successfully created"});
			}
		});
	});

	app.get("/api/:version/user/:id", function(request, response, next) {
		if (!request.params.id) {
			return response.json(200, {"success": false, "error": "Missing required parameter 'id'"});
		}

		var user = new User();

		user.loadById(request.params.id, function(error, value) {
			if (error) {
				return response.json(200, {"success": false, "error": error});
			}

			return response.json(200, value);
		});
	});

	// 404 everything else
    app.all(/^\/api\/.*/, function(request, response, next) { 
		console.log(request.method.toUpperCase() + " 404: " + request.url);
		
		response.statusCode = 404;
		response.contentType("json");
		response.send({"error": "The requested resource was not found."});
	});
}
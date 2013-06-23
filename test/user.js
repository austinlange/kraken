var request = require('superagent');
var expect = require('expect.js');

describe('API User', function() {
	it(function(done) {
		request.post('localhost:5000').end(function(res) {
			//console.log("test response: " + res);
			expect(res).to.exist;
			//expect(res.email).to.exist;
			done();
		});
	});
})
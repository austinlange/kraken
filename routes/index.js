
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Sam Rocks!' });
};

exports.admin = function(req, res){
  res.render('admin', { title: 'Sam Rocks!' });
};
exports.dashboard = function(req, res){
  res.render('admin-dashboard', { title: 'Sam Rocks!' });
};

/*
 * GET hello
 */
exports.hello = function(req, res){
	res.render('hello', {
		title:'Sam Rocks... ',
		item:GetHello(),
		body:'there are items.',
		message:GetMessage(req)
	});
}

function GetHello(){
	var arr = [];
	for(var i = 0; i<10; i++){
		arr.push("item " + i);
	}
	return arr;
}

function GetMessage(req){
	var message = "message goes here";
	console.log(message);
	return message;
}

/* 
 * POST user
 */
exports.addUser = function(req, res){
	console.log(req.params.length);
};

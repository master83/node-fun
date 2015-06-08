var express = require("express");

var app = express();

var helpers = {
	findUser: function(req, res) {
		res.end("You asked to see " + req.params.username + "\n");
	}
}

// along with app we can use any HTTP method, be like put, post, remove, get. 

// all can be used for any HTTP method

// app.get("/users", updateUser);
// app.put("/users", createUser);
app.all("/user[s]?/:username", helpers.findUser); // reg exp [s]? to make it working for /user and /users




app.get("*", function(req, res) {
	res.end("Hello World EXPRESS-STYLE!!!");
}); 

app.listen(8080);
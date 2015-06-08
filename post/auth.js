var express = require("express");
var basicAuth = require('basic-auth-connect');
var app = express();

// app.use(basicAuth("username", "secret"));

// app.get("*", function (req, res) {
// 	res.end("Secret!!!\n");
// });

app.get("/users",function(req, res){
	res.end("users \n");
});
app.get("/albums",function(req, res){
	res.end("albums \n");
});
app.get("/albums/:albumName/photos",function(req, res){
	res.end("photos \n");
});
app.get("/admin", basicAuth("username", "secret"), function (req, res) {
	res.end("secret admin page \n");
})



app.listen(5000);

//curl -X GET -u username:secret http://localhost:5000
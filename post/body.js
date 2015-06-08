var express = require('express');
var bodyParser = require('body-parser'); // puts the parsed body in req.body
var cookieParser = require('cookie-parser'); // puts them in req.cookies
var session = require('express-session'); // req.session

var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 86400000},
  store: new session.MemoryStore()
}));

app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(bodyParser.json());

app.get("*", function(req, res){
	var s = JSON.stringify(req.session);
	req.session.lastVisit = Date.now();

	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(s);
});

app.post("*", function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/json'});
	res.write('you posted:\n');
	res.end(JSON.stringify(req.body) + "\n");
});

app.use(cookieParser());
app.get("*", function (req, res) {
	// res.cookie must come before you write anything on res
	res.cookie("pet", "cat", {maxAge: 86400000}); //set cookie

	res.clearCookie("pet"); //clear cookie

	res.writeHead(200, {'Content-Type': 'text/html'});

	res.write(JSON.stringify(req.cookies) + "<br/>\n");
	res.end("Thanks!!");
});


app.listen(5000);


// curl --data "param1=value1&param2=value2" http://localhost:8080
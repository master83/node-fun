var http = require("http");

function handleRequest(req, res){
	console.log("Incoming Request: ("+ req.method +") "+req.url);

	var jsonData = "";

	req.on("readable", function() {
		var d = req.read();

		if ( typeof d == 'string' ) {
			jsonData += d;
		} else if ( typeof d == 'object' && d instanceof Buffer) {
			jsonData += d.toString("utf8");
		}
	});

	req.on("end", function() {
		var out = '';
		if( !jsonData ) {
			out = "I got no JSON";
		} else {
			var json;
			try {
				json = JSON.parse(jsonData);
			} catch (e) {

			}

			if (!json) {
				out = "Invalid JSON";
			} else {
				out = "Valid JSON Data: " + jsonData;
			}
		}
		res.end(out);
	});
}

var s = http.createServer(handleRequest);
s.listen(8080);

//curl -i -X POST -H "Content-Type:application/json" -d '{ "field1":123, "field2":"value2" }' http://localhost:8080
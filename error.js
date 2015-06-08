setTimeout(function() {
	try {
			throw new Error("Danger");
		}
	} catch (e) {
		console.log("I caught the error.");
	}
	, 2000);
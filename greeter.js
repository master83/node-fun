exports.version = "0.1.0";

// exports.helloWorld = function(language) {
// 	switch (language) {
// 		case "en":
// 			return "Hello World";
// 		case "fr":
// 			return "Bonjour tout le monde";
// 		case "it":
// 			return "Buangiorna a tutti!!";
// 		default: 
// 			return "We don't speak that language";
// 	}
// };

// exports.goodbye = function(language) {
// 	switch (language) {
// 		case "en":
// 			return "Bye";
// 		case "fr":
// 			return "Au revoir";
// 		case "it":
// 			return "Ciao!";
// 		default: 
// 			return "We don't speak that language booo .";
// 	}
// };


function Greeter (lang) {
	this.language = lang;

	this.greet = function () {
		switch (this.language) {
			case "en":
				return "Hello World";
			case "fr":
				return "Bonjour tout le monde";
			case "it":
				return "Buangiorna a tutti!!";
			default: 
				return "We don't speak that language";
		}
	};
};

// exports.createGreeter = function (lang) {
// 	return new Greeter(lang);
// }


module.exports = Greeter;


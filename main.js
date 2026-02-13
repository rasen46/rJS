// rasenJS resources v1.0.10 hotfix //
// source file: https://github.com/rasen46/rJS //

var rjs = {};

rjs.startTime = getTime();
rjs.modules = {};
rjs.storage = {
	version: "1.0.11 stable\n",
	cache: {
		func: {
			textlabel: function(id) {
				textLabel(id, "");
			},
			button: function(id) {
				button(id, "");
			},
			textinput: function(id) {
				textInput(id, "");
			},
			textarea: function(id) {
				textArea(id, "");
			},
			imageuploadbutton: function(id) {
				imageUploadButton(id);
			},
			radiobutton: function(id) {
				radioButton(id, false);
			},
			checkbox: function(id) {
				checkbox(id, false);
			},
			image: function(id) {
				image(id, "icon://fa-times");
			}
		},
		validElements: {
			text: ["textlabel", "button", "textinput", "textarea", "imageuploadbutton"],
			bool: ["radiobutton", "checkbox"],
			imag: ["image"]
		},
		chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	}
};

function checkValidParams(args, scriptName) {
	for (var expectedTypeVal in args) {
		for (var variableName in args[expectedTypeVal]) {
			if (typeof args[expectedTypeVal][variableName] == expectedTypeVal) {
				continue;
			} else {
				print("got incorrect parameter for " + variableName + ", expected " + expectedTypeVal + ", but got " + (typeof args[expectedTypeVal][variableName]) + " (" + args[expectedTypeVal][variableName] + ")", "ERROR", scriptName || "nil");
				return false;
			}
		}
	}
	return true;
}

//Forces a number to be between a range
//x {number} - the number to clamp
//minimum {number} - the minimum x should be
//maximum {number} - the maximum x should be
function clamp(x, minimum, maximum) {
	if (!checkValidParams({
			number: {
				x: x,
				minimum: minimum,
				maximum: maximum
			}
		}, "clamp")) return;
	return Math.max(minimum, Math.min(maximum, x));
}

//Linear Interpolation using alpha
//a {number} - starting value
//b {number} - ending value
//alpha {number} - alpha (percentage to 'b')
function lerp(a, b, alpha) {
	if (!checkValidParams({
			number: {
				a: a,
				b: b,
				alpha: alpha
			}
		}, "lerp")) return;
	return a + (b - a) * alpha;
}

//Linear lerping for element properties
//property {object} - should be formatted like this {from: {width: 0}, to: {width: 1}}
//alpha {number} - alpha (percentage to 'b')
function lerpProperty(property, alpha) {
	if (!checkValidParams({
			number: {
				alpha: alpha
			},
			object: {
				property: property
			}
		}, "lerpProperty")) return;
	if (!property.to || !property.from) return print("no from/to defined", "WARN");
	var endProperties = {};

	for (var elementProperty in property.from) {
		if (elementProperty.includes("color")) {
			var from, to;

			if (property.from[elementProperty].includes("rgba")) {
				from = property.from[elementProperty]
					.replace("rgba(", "")
					.replace(")", "")
					.split(",");
			} else {
				from = property.from[elementProperty]
					.replace("rgb(", "")
					.replace(")", "")
					.split(",");
				from.push("1");
			}

			if (property.to[elementProperty].includes("rgba")) {
				to = property.to[elementProperty]
					.replace("rgba(", "")
					.replace(")", "")
					.split(",");
			} else {
				to = property.to[elementProperty]
					.replace("rgb(", "")
					.replace(")", "")
					.split(",");
				to.push("1");
			}

			endProperties[elementProperty] = rgb(
				lerp(parseFloat(from[0]) || 0, parseFloat(to[0]) || 0, alpha),
				lerp(parseFloat(from[1]) || 0, parseFloat(to[1]) || 0, alpha),
				lerp(parseFloat(from[2]) || 0, parseFloat(to[2]) || 0, alpha),
				lerp(parseFloat(from[3]) || 0, parseFloat(to[3]) || 0, alpha)
			);
		} else {
			endProperties[elementProperty] = lerp(property.from[elementProperty], property.to[elementProperty], alpha);
		}
	}

	return endProperties;
}

//Linear Interpolation using alpha with RGB values (prone to errors, use RBGA instead)
//rgb1 {string} - starting RGB value
//rgb2 {string} - ending RGB value
//alpha {number} - alpha (percentage to rgb2)
function lerpRGB(rgb1, rgb2, alpha) {
	if (!checkValidParams({
			number: {
				alpha: alpha
			},
			string: {
				rgb1: rgb1,
				rgb2: rgb2
			}
		}, "lerpRGB")) return;
	var c = [rgb1.replace("rgb(", "").replace(")", "").split(","),
		rgb2.replace("rgb(", "").replace(")", "").split(",")
	];

	return rgb(
		lerp(parseFloat(c[0][0]) || 0, parseFloat(c[1][0]) || 0, alpha),
		lerp(parseFloat(c[0][1]) || 0, parseFloat(c[1][1]) || 0, alpha),
		lerp(parseFloat(c[0][2]) || 0, parseFloat(c[1][2]) || 0, alpha)
	);
}

//Linear Interpolation using alpha with RGBA values
//rgba1 {string} - starting RGB value
//rgba2 {string} - ending RGB value
//alpha {number} - alpha (percentage to rgba2)
function lerpRGBA(rgba1, rgba2, alpha) {
	if (!checkValidParams({
			number: {
				alpha: alpha
			},
			string: {
				rgba1: rgba1,
				rgba2: rgba2
			}
		}, "lerpRGBA")) return;
	var c = [rgba1.replace("rgba(", "").replace(")", "").split(","),
		rgba2.replace("rgba(", "").replace(")", "").split(",")
	];
	return rgb(
		lerp(parseFloat(c[0][0]) || 0, parseFloat(c[1][0]) || 0, alpha),
		lerp(parseFloat(c[0][1]) || 0, parseFloat(c[1][1]) || 0, alpha),
		lerp(parseFloat(c[0][2]) || 0, parseFloat(c[1][2]) || 0, alpha),
		lerp(parseFloat(c[0][3]) || 0, parseFloat(c[1][3]) || 0, alpha)
	);
}

function easing(a, dir, power) {
	if (dir.toLowerCase() == "in") {
		return Math.pow(a, power);
	} else if (dir.toLowerCase() == "out") {
		return 1 - Math.pow(1 - a, power);
	} else if (dir.toLowerCase() == "inout" || dir.toLowerCase() == "outin") {
		return a < 0.5 ? Math.pow(2 * a, power) / 2 : 1 - Math.pow(2 - 2 * a, power) / 2;
	} else {
		print("invaild direction for tweeing, defaulting alpha to 1", "WARN", "easing");
		return 1;
	}
}

//Exponential lerping (not performant)
//a {number} - starting number
//b {number} - ending number
//easingExponent {number} - exponent 'alpha' should accend by
//easingDirection {"in"/"out"/"inout"} - direction of exponential curve
//alpha {number} - alpha (percentage to 'b')
function tween(a, b, easingExponent, easingDirection, alpha) {
	if (!checkValidParams({
			number: {
				a: a,
				b: b,
				easingExponent: easingExponent,
				alpha: alpha
			},
			string: {
				easingDirection: easingDirection
			}
		}, "tween")) return;
	return a + (b - a) * easing(alpha, easingDirection, easingExponent);
}

//Exponential lerping for element properties (not performant)
//property {object} - should be formatted like this {from: {width: 0}, to: {width: 1}}
//easingExponent {number} - exponent 'alpha' should accend by
//easingDirection {"in"/"out"/"inout"} - direction of exponential curve
//alpha {number} - alpha (percentage to 'b')
function tweenProperty(property, easingExponent, easingDirection, alpha) {
	if (!checkValidParams({
			number: {
				easingExponent: easingExponent,
				alpha: alpha
			},
			string: {
				easingDirection: easingDirection
			},
			object: {
				property: property
			}
		}, "tweenProperty")) return;
	var endProperties = {};

	for (var elementProperty in property.from) {
		if (elementProperty.includes("color")) {
			var from, to;

			if (property.from[elementProperty].includes("rgba")) {
				from = property.from[elementProperty]
					.replace("rgba(", "")
					.replace(")", "")
					.split(",");
			} else {
				from = property.from[elementProperty]
					.replace("rgb(", "")
					.replace(")", "")
					.split(",");
				from.push("1");
			}

			if (property.to[elementProperty].includes("rgba")) {
				to = property.to[elementProperty]
					.replace("rgba(", "")
					.replace(")", "")
					.split(",");
			} else {
				to = property.to[elementProperty]
					.replace("rgb(", "")
					.replace(")", "")
					.split(",");
				to.push("1");
			}

			endProperties[elementProperty] = rgb(
				tween(parseFloat(from[0]) || 0, parseFloat(to[0]) || 0, easingExponent, easingDirection, alpha),
				tween(parseFloat(from[1]) || 0, parseFloat(to[1]) || 0, easingExponent, easingDirection, alpha),
				tween(parseFloat(from[2]) || 0, parseFloat(to[2]) || 0, easingExponent, easingDirection, alpha),
				tween(parseFloat(from[3]) || 0, parseFloat(to[3]) || 0, easingExponent, easingDirection, alpha)
			);
		} else {
			endProperties[elementProperty] = tween(property.from[elementProperty], property.to[elementProperty], easingExponent, easingDirection, alpha);
		}
	}

	return endProperties;
}

//Logs a debug print into console
//text {any} - the text that will be logged into console
//type (optional) {string} - the type of log that will be logged into console (warn, info, etc.) (defaults to INFO)
//scriptName (optional) {string} - the name of the log that will be logged into console (defaults to script.js)
function print(text, type, scriptName) {
	var cTime = getTime() - rjs.startTime,
		scNM = scriptName || "script.js";

	var totalSeconds = Math.floor(cTime / 1000),
		m = Math.floor(totalSeconds / 60) || 0,
		s = totalSeconds % 60 || 0,
		ms = (cTime % 1000);

	var formatToReadable =
		(m < 10 ? "0" : "") + m + ":" +
		(s < 10 ? "0" : "") + s + ":" +
		(ms < 100 ? (ms < 10 ? "00" : "0") : "") + ms;

	var logType = (type ? typeof type == "string" ? type.toUpperCase() : "INFO" : "INFO");
	console.log("[" + formatToReadable + "] " + "[" + scNM + "/" + logType + "]: " + text);
}

//Converts tables exclusively using {"key":[]} into strings
//obj {object} - table to convert to string
function stringfy(obj) {
	if (!checkValidParams({
			object: {
				obj: obj
			}
		}, "stringfy")) return;
	var string = "{\n",
		k = true;

	for (var key in obj) {
		if (!k) string += ",\n";
		k = false;

		string += '"' + key + '": [' + obj[key] + ']';
	}

	string += "\n}";
	return string;
}

//Removes the last item from an array
//array {object} - the array to remove from
function pop(array) {
	if (!checkValidParams({
			object: {
				array: array
			}
		}, "lerpRGB")) return;
	return array.slice(0, -1);
}

//Converts base64 into a usable string
//str {string} - the base64 to convert to a string
function atob(str) {
	if (!checkValidParams({
			string: {
				str: str
			}
		}, "atob")) return;
	//used a tutorial since i idk how base64 works
	var chars = rjs.storage.cache.chars,
		output = "",
		buffer = 0,
		bits = 0,
		i = 0;

	str = str.replace(/=+$/, "");
	for (i = 0; i < str.length; i++) {
		var val = chars.indexOf(str.charAt(i));
		if (val < 0) continue;

		buffer = (buffer << 6) | val;
		bits += 6;
		if (bits >= 8) {
			bits -= 8;
			output += String.fromCharCode((buffer >> bits) & 0xFF);
		}
	}
	return output;
}

//Converts a string into base64
//str {string} - the string to convert to base64
function btoa(str) {
	if (!checkValidParams({
			string: {
				str: str
			}
		}, "btoa")) return;
	//used a tutorial since i idk how base64 works
	var chars = rjs.storage.cache.chars,
		output = "",
		i = 0;

	while (i < str.length) {
		var b1 = str.charCodeAt(i++) & 255,
			b2 = i < str.length ? str.charCodeAt(i++) & 255 : -1,
			b3 = i < str.length ? str.charCodeAt(i++) & 255 : -1;

		var triplet =
			(b1 << 16) |
			((b2 > -1 ? b2 : 0) << 8) |
			(b3 > -1 ? b3 : 0);

		output += chars.charAt((triplet >> 18) & 63);
		output += chars.charAt((triplet >> 12) & 63);
		output += b2 === -1 ? "=" : chars.charAt((triplet >> 6) & 63);
		output += b3 === -1 ? "=" : chars.charAt(triplet & 63);
	}

	return output;
}

//Loads a module from Github or any page that uses B64 (deprecated) (DANGEROUS)
//url {string} - https://api.github.com/repos/<name>/<repoName>/contents/<path>
function loadModule(url) {
	if (!checkValidParams({
			string: {
				url: url
			}
		}, "loadModule")) return;
	startWebRequest(url, function(status, type, content) {
		if (status == 200) {
			var usableData = JSON.parse(content),
				b64 = usableData.content,
				fName = usableData.name;
			if (!atob(b64) || !fName) {
				return print("failed to load module due to invaild base64 or fileName", "WARN");
			} else rjs.modules[fName] = eval(atob(b64));
		} else {
			return print("failed to load module: " + status, "WARN");
		}
	});
}

//Gets the contents of any page (async)
//url {string} - a URL
//callback {function} - the function that gets triggered after this function completes (returns content)
function getPageContents(url, callback) {
	if (!checkValidParams({
			string: {
				url: url
			},
			function: {
				callback: callback
			}
		}, "getPageContents")) return;
	startWebRequest(url, function(status, type, content) {
		if (status == 200) {
			callback(content);
		} else {
			return print("failed to retrieve page: " + content + " (" + url + ")", "ERROR", "getPageContents");
		}
	});
}

//Requires a module loaded into the app (deprecated)(async)
//name {string} - file name
//callback {function(var)} - read documentation: https://github.com/rasen46/rJS 
//max (optional) {number} - maximum about of attempts before required module gets dropped
function require(name, callback, max) {
	if (!checkValidParams({
			string: {
				name: name
			},
			function: {
				callback: callback
			}
		}, "require")) return;
	var maxAttempts = Math.abs(max) || 5,
		i = 0,
		required = false,
		tl;

	tl = timedLoop(100, function() {
		if (required) {
			stopTimedLoop(tl);
		} else if (typeof rjs.modules[name] == "object") {
			callback(rjs.modules[name]);
			required = true;
		} else if (i >= maxAttempts) {
			print("took too long to retrieve requested module: " + name, "WARN");
			callback(undefined);
			required = true;
		}
		i++;
	});
}

//Creates a element, use createElement("help") for a list of 'vaild elements'
//element {string} - the element to create
//id {string} - the assigned id to the element
//additional (optional) {object} - properties to change about the element: {"width": 20, "height": 20}
function createElement(element, id, additional) {
	if (!checkValidParams({
			string: {
				element: element,
				id: id
			}
		}, "createElement")) return;
	element = element.toLowerCase();

	var validElements = rjs.storage.cache.validElements;

	if (element == "help") {
		print("all valid elements:");
		print("Text: " + validElements.text.join(", "));
		print("Bool: " + validElements.bool.join(", "));
		print("Image: " + validElements.imag.join(", "));
		return;
	}

	var func = rjs.storage.cache.func;

	var f = false;
	for (var key in validElements) {
		if (validElements[key].indexOf(element) != -1) {
			f = true;
			break;
		}
	}

	if (!f || !func[element]) {
		print("unknown element '" + element + "'", "WARN", "createElement");
		return;
	}

	func[element](id);
	setPosition(id, 160, 225);

	if (typeof additional == "object" && additional != null) {
		for (var prop in additional) {
			setProperty(id, prop, additional[prop]);
		}
	}
}

//Gets a random item from an array
//array {object} - the array to get from
function arrGetRnd(array) {
	if (!checkValidParams({
			object: {
				array: array
			}
		}, "arrGetRnd")) return;
	return array[randomNumber(0, array.length - 1)];
}

//Pushes a item to an array at a random index
//array {object} - the array to get from
//obj {any} - the item to insert
function arrInsertRnd(array, obj) {
	if (!checkValidParams({
			object: {
				array: array
			}
		}, "arrInsertRnd")) return;
	return array.splice(randomNumber(0, array.length - 1), 0, obj);
}

//Removes a random item in an array
//array {object} - the array to remove from
function arrRemoveRnd(array) {
  if (!checkValidParams({
		object: {
			array: array
		}
	}, "arrRemoveRnd")) return;
	return array.splice(randomNumber(0, array.length - 1), 1);
}

//Removes any item that matches with a item in `list`
//array {object} - the array to check
//list {object} - the blacklist
function arrBlacklist(array, list) {
  if (!checkValidParams({
		object: {
			array: array,
			list: list
		}
	}, "arrBlacklist")) return;
	
	var newArray = [];
	for (var i in array) {
	  for (var ii in list) {
	    if (array[i] != list[ii]) newArray.push(list[ii]);
	  }
	}
	
	return newArray;
}

//Only adds item that matches with a item in `list`
//array {object} - the array to check
//list {object} - the whitelist
function arrWhitelist(array, list) {
  if (!checkValidParams({
		object: {
			array: array,
			list: list
		}
	}, "arrWhitelist")) return;
	
	var newArray = [];
	for (var i in array) {
	  for (var ii in list) {
	    if (array[i] == list[ii]) newArray.push(list[ii]);
	  }
	}
	
	return newArray;
}

//Freezes the entire project for a certain amount of time (DANGEROUS)
//time {number} - the amount of time (in seconds) to hang the project for
function hang(time) {
	if (!checkValidParams({
			number: {
				time: time
			}
		}, "hang")) return;
	var gt = getTime() + Math.abs(time * 1000);

	for (var i = getTime(); gt >= getTime(); i = getTime()) {
		if (i == i) i = i;
	}

	return true;
}

//Returns the root of a number
//number {number} - the number to root
//root {number} - the number to root by
function numrt(number, root) {
	if (!checkValidParams({
			number: {
				number: number,
				root: root
			}
		}, "numrt")) return;
	return Math.pow(number, 1 / root);
}

print(
  "\n  _____      _  _____ _ \n" +
	" |  __ \\    | |/ ____| |\n" +
	" | |__) |   | | (___ | |\n" +
	" |  _  /_   | |\\___ \\| |\n" +
	" | | \\ \\ |__| |____) | |____\n" +
	" |_|  \\_\\____/|_____/|______|\n" +
	"rasen's Javascript Library\n" +
	"version: " + rjs.storage.version.replace("\n", ""), "ENGINE_CHECK", "RJSL"
);

getPageContents("https://api.github.com/repos/rasen46/rJS/contents/version.txt", function(c) {
	var content = atob(JSON.parse(c).content);
	if (content != rjs.storage.version) {
		print("library is out of date or beta build, latest stable version: " + content, "VERSION_CHECK", "RJSL");
	} else {
		print("up to date", "VERSION_CHECK", "RJSL");
	}
});
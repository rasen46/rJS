// rasenJS resources v1.0.7 real //
// source file: https://github.com/rasen46/rJS //

var rjs = {};

rjs.startTime = getTime();
rjs.modules = {};
rjs.storage = {};

//Forces a number to be between a range
//x {number} - the number to clamp
//minimum {number} - the minimum x should be
//maximum {number} - the maximum x should be
function clamp(x, minimum, maximum) {
	if (typeof x != "number" || typeof minimum != "number" || typeof maximum != "number") return print("got malformed x/min/max (is it a number?) (clamp)", "WARN");
	return Math.max(minimum, Math.min(maximum, x));
}

//Linear Interpolation using alpha
//a {string} - starting value
//b {string} - ending value
//alpha {number} - alpha (percentage to 'b')
function lerp(a, b, alpha) {
	if (typeof a != "number" || typeof b != "number" || typeof alpha != "number") return print("got malformed start/end/alpha values (is it a number?) (lerp)", "WARN");
	return a + (b - a) * alpha;
}

//Linear Interpolation using alpha with RGB values (prone to errors, use RBGA instead)
//rgb1 {string} - starting RGB value
//rgb2 {string} - ending RGB value
//alpha {number} - alpha (percentage to rgb2)
function lerpRGB(rgb1, rgb2, alpha) {
	if (typeof rgb1 != "string" || typeof rgb2 != "string" || typeof alpha != "number") return print("got malformed rgb/alpha values (is it a string/number?) (lerpRGB)", "WARN");
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
	if (typeof rgba1 != "string" || typeof rgba2 != "string" || typeof alpha != "number") return print("got malformed rgba/alpha values (is it a string/number?) (lerpRGBA)", "WARN");
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
		print("invaild direction for tweeing, defaulting to 1", "WARN");
		return 1;
	}
}

//Exponential lerping (less performant)
//a {number} - starting number
//b {number} - ending number
//easingExponent {number} - exponent 'alpha' should accend by
//easingDirection {"in"/"out"/"inout"} - direction of exponential curve
//alpha {number} - alpha (percentage to 'b')
function tween(a, b, easingExponent, easingDirection, alpha) {
	if (typeof a != "number" || typeof b != "number" || typeof alpha != "number") return print("got malformed start/end/alpha values (is it a number?) (tween)", "WARN");
	if (typeof easingExponent != "number" || typeof easingDirection != "string") return print("got malformed expo/dir values (is it num/string?) (tween)", "WARN");
	return a + (b - a) * easing(alpha, easingDirection, easingExponent);
}

//Logs a debug print into console
//text {any} - the text that will be logged into console
//type (optional) {string} - the type of log that will be logged into console (warn, info, etc)
//scriptName (optional) {string} - the name of the log that will be logged into console
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

//Converts a Base64 into a usable string
//str {string} - the base64 to convert to a string
function atob(str) {
	if (typeof str != "string") return print("got malformed string (is it a string?) (atob)", "WARN");
	//used a tutorial since i idk how base64 works
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		output = "",
		buffer = 0,
		bits = 0;

	str = str.replace(/=+$/, "");
	for (var i = 0; i < str.length; i++) {
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

//Converts a string into Base64
//str {string} - the string to convert to base64
function btoa(str) {
	if (typeof str != "string") return print("got malformed string (is it a string?) (btoa)", "WARN");
	//used a tutorial since i idk how base64 works
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
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

//Loads a module from Github or any page that uses B64 (deprecated)
//url {string} - https://api.github.com/repos/<name>/<repoName>/contents/<path>
function loadModule(url) {
	if (typeof url != "string") return print("got malformed url (is it a string?) (loadModule)", "WARN");
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

//Requires a module loaded into the app (deprecated)
//name {string} - file name
//callback {function(var)} - read documentation: https://github.com/rasen46/rJS 
//max (optional) {number} - maximum about of attempts before module gets dropped
function require(name, callback, max) {
	if (typeof name != "string" || typeof callback != "function") return print("got malformed name/callback (is it a string/function?) (require)", "WARN");
	var maxAttempts = Math.abs(max) || 5,
		i = 0,
		required;

	var tl = timedLoop(100, function() {
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

//Creates a element (buttons, images, etc)
//element {string} - the element to create
//id {string} - the assigned id to the element
//additional (optional) {json} - properties to change about the element
function createElement(element, id, additional) {
	if (!element || !id || typeof element != "string" || typeof id != "string") return print("got malformed element or id (is it a string?) (createElement)");
	var vaildElements = ["button", "textInput", "textLabel", "dropdown", "checkbox", "textArea", "imageUploadButton", "image"];
	for (var i in vaildElements) {
		if (vaildElements[i].toLowerCase() == element.toLowerCase()) {
			eval(vaildElements[i] + "('" + id + "',false)");
		}
	}
	if (additional) {
		for (var i in additional) {
			setProperty(id, i, additional[i]);
		}
	}
}

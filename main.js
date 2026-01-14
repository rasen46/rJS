var rjs = {
	startTime: getTime(),
	modules: {},

	// rasenJS resources v1.0.2 real //
	// source file: https://github.com/rasen46/rJS //
	print: function(text, type) {
		var cTime = getTime() - rjs.startTime;

		var totalSeconds = Math.floor(cTime / 1000),
			m = Math.floor(totalSeconds / 60) || 0,
			s = totalSeconds % 60 || 0,
			ms = (cTime % 1000);

		var formatToReadable =
			(m < 10 ? "0" : "") + m + ":" +
			(s < 10 ? "0" : "") + s + ":" +
			(ms < 100 ? (ms < 10 ? "00" : "0") : "") + ms;

		var logType = (type ? typeof type == "string" ? type.toUpperCase() : "INFO" : "INFO");
		console.log("[" + formatToReadable + "] " + "[script.js/" + logType + "]: " + text);
	},

	atob: function(str) {
		if (!str || typeof str != "string") return rjs.print("got malformed string (is it a string?)", "WARN");
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
	},

	loadModule: function(url) {
		if (!url || typeof url != "string") return rjs.print("got malformed url (is it a string?)", "WARN");
		startWebRequest(url, function(status, type, content) {
			if (status == 200) {
				var usableData = JSON.parse(content),
					b64 = usableData.content,
					fName = usableData.name;
				if (!rjs.atob(b64) || !fName) {
					return rjs.print("failed to load module due to invaild base64 or fileName", "WARN");
				} else rjs.modules[fName] = eval(rjs.atob(b64));
			} else {
				return rjs.print("failed to load module: " + status, "WARN");
			}
		});
	},

	require: function(name, callback, max) {
		if (!name || typeof name != "string") return rjs.print("got malformed name (is it a string?)", "WARN");

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
				rjs.print("took too long to retrieve requested module: " + name, "WARN");
				callback(undefined);
				required = true;
			}
			i++;
		});
	}
};

(function () {
  var module = {
    clamp: function(value, m, n) {
        if (typeof value != "number" || typeof m != "number" || typeof n != "number") return rjs.print("got malformed value or min/max (is it a number?)", "WARN");
		return Math.max(m, Math.min(n, value));
	},

	lerp: function(st, ed, a) {
        if (typeof st != "number" || typeof ed != "number" || typeof a != "number") return rjs.print("got malformed start/end/alpha values (is it a number?)", "WARN");
		return st + (ed - st) * a;
	},

	lerpRGB: function(rgb1, rgb2, a) {
		if (!rgb1 || !rgb2 || !a || typeof rgb1 != "string" || typeof rgb2 != "string" || typeof a != "number") return rjs.print("got malformed rgb or alpha values (is it a string or number?)", "WARN");
		var c = [rgb1.replace("rgb(", "").replace(")", "").split(","),
			rgb2.replace("rgb(", "").replace(")", "").split(",")
		];

		return rgb(
			rjs.lerp(parseFloat(c[0][0]) || 0, parseFloat(c[1][0]) || 0, a),
			rjs.lerp(parseFloat(c[0][1]) || 0, parseFloat(c[1][1]) || 0, a),
			rjs.lerp(parseFloat(c[0][2]) || 0, parseFloat(c[1][2]) || 0, a)
		);
	},

	lerpRGBA: function(rgba1, rgba2, a) {
		if (!rgba1 || !rgba2 || !a || typeof rgba1 != "string" || typeof rgba2 != "string" || typeof a != "number") return rjs.print("got malformed rgb or alpha values (is it a string or number?)", "WARN");
		var c = [rgba1.replace("rgba(", "").replace(")", "").split(","),
			rgba2.replace("rgba(", "").replace(")", "").split(",")
		];
		return rgb(
			rjs.lerp(parseFloat(c[0][0]) || 0, parseFloat(c[1][0]) || 0, a),
			rjs.lerp(parseFloat(c[0][1]) || 0, parseFloat(c[1][1]) || 0, a),
			rjs.lerp(parseFloat(c[0][2]) || 0, parseFloat(c[1][2]) || 0, a),
			rjs.lerp(parseFloat(c[0][3]) || 0, parseFloat(c[1][3]) || 0, a)
		);
	},
  };
  return module;
})({});
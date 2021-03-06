"use strict";

var defaults = require("lodash.defaultsdeep");
var minify = require("html-minifier").minify;
var multimatch = require("multimatch");

module.exports = function htmlMinifier(pattern, opts = {}) {
	/* allow the first argument to be options */
	var options = opts;
	var patternDefault = "*.html";
	if (typeof arguments[0] === "object" && !Array.isArray(arguments[0])) {
		options = arguments[0];
		options.pattern = options.pattern || patternDefault;
	} else {
		options.pattern = pattern || patternDefault;
	}

	defaults(options, {
		// See the README explainations of each of these options
		"collapseBooleanAttributes": true,
		"collapseWhitespace": true,
		"removeAttributeQuotes": true,
		"removeComments": true,
		"removeEmptyAttributes": true,
		"removeRedundantAttributes": true,
	});
	return function plugin(files, metalsmith, done) {
		try {
			Object.keys(files)
			.forEach(function (file) {
				if (multimatch(file, options.pattern, {matchBase: true}).length) {
					var data = files[file];
					var contents = data.contents.toString();
					var minified = minify(contents, options);
					data.contents = new Buffer(minified, "utf8");
				}
			});
			done();
		} catch (e) {
			done(e);
		}
	};
};

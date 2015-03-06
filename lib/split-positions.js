var camel = require('to-camel-case');

module.exports = function make_splitter(property) {
	var camel_property = camel(property);
	return function (rule) {
		var properties = rule.properties;
		var value = properties[camel_property];
		if (!value) return;

		var top, bottom, left, right;

		var pieces = value.split(/\W+/);
		var length = pieces.length;

		if (length === 1) {
			top = bottom = left = right = pieces[0];
		} else if (length === 2) {
			top = bottom = pieces[0];
			left = right = pieces[1];
		} else if (length === 3) {
			top = pieces[0];
			left = right = pieces[1];
			bottom = pieces[2];
		} else {
			top = pieces[0];
			right = pieces[1];
			bottom = pieces[2];
			left = pieces[3];
		}

		var parts = property.split("-");
		var prefix = parts.shift();
		var suffix = camel(parts.join("-"));

		if (top !== undefined) properties[prefix + "Top" + suffix] = top;
		if (right !== undefined) properties[prefix + "Right" + suffix] = right;
		if (bottom !== undefined) properties[prefix + "Bottom" + suffix] = bottom;
		if (left !== undefined) properties[prefix + "Left" + suffix] = left;
		delete properties[property];
	}
}

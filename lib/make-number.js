module.exports = function (property) {
	return function (rule) {
		var properties = rule.properties;

		var value = properties[property];
		if (!value) return;

		var match = value.match(/(\d+)/);
		if (!match || !match[1]) return

		properties[property] = parseFloat(match[1]);
	}
}

var splitPositions = require("./split-positions");
var makeNumber = require("./make-number");
var camel = require('to-camel-case');

module.exports = agument_parser;

function agument_parser(parser) {
	var sided_properties = ["margin", "padding", "border-width"];
	var to_numberify = ["width", "height", "flex", "top", "right", "bottom", "left"]
		.concat(
			sided_properties
			.map(make_sides)
			.reduce(concat, [])
		);

	var processors = sided_properties
		.map(splitPositions)
		.concat(
			to_numberify
			.map(makeNumber)
		);

	parser.process(processors);
}

function make_sides(name) {
	var parts = name.split("-");
	var prefix = parts.shift();
	var suffix = camel(parts.join("-"));

	return ["Top", "Right", "Bottom", "Left"].map(function (side) {
		return prefix + side + suffix;
	});
}

function concat(prev, current) {
	return prev.concat(current);
}

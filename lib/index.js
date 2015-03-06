var par = require("par");
var xtend = require("xtend");
var camel = require('to-camel-case');
var parseBasicProperties = require("./parse-basic-properties");

Parser.Parser = Parser;

function Parser() {
	this.processors = [];
	parseBasicProperties(this);
}

Parser.prototype.parse = parse;
Parser.prototype.process = process;

module.exports = new Parser();

function process(fn) {
	if (fn.forEach)
		this.processors = this.processors.concat(fn);
	else this.processors.push(fn);
	return this;
}

function parse(text) {
	var rules = parse_rules(text);
	return build_rules(this, rules);
}

function build_rules(parser, rules) {
	return rules
		.map(par(build_property_map, parser))
		.map(par(run_processors, parser))
		.reduce(add_rule_to_map, {});
}

function add_rule_to_map(map, rule) {
	var query = rule.query;
	map[query] = xtend(map[query] || {}, rule.properties);
	return map;
}

function build_property_map(parser, rule) {
	var properties = rule.properties.reduce(add_property, {});
	return xtend(rule, {
		properties: properties
	});
}

function run_processors(parser, rule) {
	parser.processors.forEach(run_with(rule));
	return rule;
}

function run_with(data) {
	return function (fn) {
		return fn(data);
	}
}

function add_property(properties, property) {
	var property_name = property.property;
	var property_value = property.value;
	properties[property_name] = property_value;
	return properties;
}

function parse_rules(text) {
	var rule_parser = /(\S+)\s*{([^}]*)}/gm;
	return process_matches(rule_parser, text, process_rule_pair);
}

function process_rule_pair(matches) {
	return {
		query: matches[1],
		properties: parse_properties(matches[2])
	};
}

function parse_properties(text) {
	var property_parser = /([\w|-]+)\W*:\W*(.+);/gm;
	return process_matches(property_parser, text, process_property_pair);
}

function process_property_pair(matches) {
	return {
		property: camel(matches[1].toLowerCase()),
		value: matches[2]
	};
}

function process_matches(regexp, text, fn) {
	var match;
	var results = [];
	while (match = regexp.exec(text))
		results.push(fn(match));
	return results;
}

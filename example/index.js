var fs = require("fs");
var Parser = require("../");

var style_text = fs.readFileSync(__dirname + "/style.css", "utf8");

console.log(Parser.parse(style_text));

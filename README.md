# simple-css
Parse out simple css rules for classes, ids,  and tag names

This module was made to be used with [facebook-layout](https://github.com/facebook/css-layout) so it converts relevant properties into numbers, and expands shorthand properties when needed.

## Installing

```sh
npm install --save simple-css
```

## Example

style.css:

``` css
.class-name {
	height: 100px;
	padding: 10px 0px;
}
div {
	background: #FFF;
	margin-left: 10px;
}
#myelement {
	flex-direction: column;
	box-shadow: inset 1px 1px 4px 0px rgba(255, 0, 0, 0.5);
	border-width: 3px;
}
div {
	color: red;
}
```

index.js:

``` javascript
var fs = require("fs");
var simpleCSS = require("simple-css");


var style_text = fs.readFileSync("style.css", "utf8");

var style_map = simpleCSS.parse(style_text);
console.log(style_map);
```

output:
``` json
{
	".class-name": {
		"height": 100,
		"paddingTop": 10,
		"paddingRight": 0,
		"paddingBottom": 10,
		"paddingLeft": 0
	},
	"div": {
		"background": "FFF",
		"marginLeft": 10,
		"color": "red"
	},
	"#myelement": {
		"flexDirection": "column",
		"boxShadow": "inset 1px 1px 4px 0px rgba(255, 0, 0, 0.5)",
		"borderWidth": "3px",
		"borderTopwidth": 3,
		"borderRightwidth": 3,
		"borderBottomwidth": 3,
		"borderLeftwidth": 3
	}
}
```

## How it works

The library parses out rules from a stylesheet, and considers the entire query part as one thing. The point is to limit your rules to only apply on simple selectors that just match a single class, id, or tag.

If there are rules that have the same query, they are merged together, with the properties in the later rule overwriting the earlier one, just like it does in the browser.

The properties for each rule are then turned into an object that's similar to `Element.style` in that the property is converted to camelCase. The actual values, however usually remain unchanged.

Since this is meant to work with the `css-layout` module, certain properties are parsed to make it easier for that library to consume them.

Specifically: `margin`, `padding`, and `border-width` are converted into the longer "`marginTop`, `marginLeft`, etc" form.

`width`, `height`, `flex`, `top`, `bottom`, `left`, `right`, and the previously mentioned properties are converted to JavaScript numbers. Be careful because `px`, `%`, and `em` are converted to the same number.

## Warning

The parser isn't very smart, so try not to feed it malformed CSS.

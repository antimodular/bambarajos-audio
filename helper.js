// Javascript doesn't have built-in support for ranges
// Insted we use arrays of two elements to represent ranges
//https://rosettacode.org/wiki/Map_range#JavaScript

//newValue = mapRange([0, 10], [-1, 0], currentValue);
var mapRange = function(val, from, to) {
  return to[0] + (val - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};

var clampBetween = function(min, max, val) {
  return Math.min(Math.max(val, min), max);
};

var ofClamp = function(value, min, max) {
	return value < min ? min : value > max ? max : value;
}
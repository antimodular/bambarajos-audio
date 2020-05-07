// Javascript doesn't have built-in support for ranges
// Insted we use arrays of two elements to represent ranges
//https://rosettacode.org/wiki/Map_range#JavaScript

//newValue = mapRange([0, 10], [-1, 0], currentValue);
var mapRange = function(from, to, s) {
  return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};
// Javascript doesn't have built-in support for ranges
// Insted we use arrays of two elements to represent ranges
var mapRange = function(from, to, s) {
  return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};
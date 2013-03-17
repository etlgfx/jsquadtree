var assert = require('assert');

var QuadTree = require('../js/quadtree');

var x = 0, y = 0, size = 512;

assert.throws(new QuadTree(), 'x,y,size are required');

var qt = new QuadTree({x: x, y: y, size: size});

assert.equal(qt.bounds[0], x);
assert.equal(qt.bounds[1], y);
assert.equal(qt.bounds[2], x + size);
assert.equal(qt.bounds[3], y + size);

console.log(qt);

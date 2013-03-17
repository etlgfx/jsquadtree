var assert = require('assert');

var QuadTree = require('../js/quadtree');

var x = 0, y = 0, size = 512;

assert.throws(function () { new QuadTree() }, 'x,y,size are required');
assert.throws(function () { new QuadTree([0, 0]) }, 'x,y,size are required');

var qt = new QuadTree({x: x, y: y, size: size});

assert.equal(qt.bounds[0], x);
assert.equal(qt.bounds[1], y);
assert.equal(qt.bounds[2], x + size);
assert.equal(qt.bounds[3], y + size);
assert.equal(qt.config.maxDepth, QuadTree.maxDepth);
assert.equal(qt.config.maxFill, QuadTree.maxFill);

var qt = new QuadTree({x: x, y: y, size: size, maxDepth: 1, maxFill: 1});
assert.equal(qt.config.maxDepth, 1);
assert.equal(qt.config.maxFill, 1);

console.log(qt);

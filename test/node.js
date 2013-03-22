var assert = require('assert');

var QuadTree = require('../js/quadtree');

var x = 0, y = 0, size = 512;

assert.throws(function () { new QuadTree() }, 'x,y,size are required');
assert.throws(function () { new QuadTree([0, 0]) }, 'x,y,size are required');

var qt = new QuadTree({x: x, y: y, size: size});

assert.equal(x,        qt.bounds[0]);
assert.equal(y,        qt.bounds[1]);
assert.equal(x + size, qt.bounds[2]);
assert.equal(y + size, qt.bounds[3]);

assert.equal(QuadTree.maxDepth, qt.config.maxDepth);
assert.equal(QuadTree.maxFill,  qt.config.maxFill);

var qt = new QuadTree({x: x, y: y, size: size, maxDepth: 2, maxFill: 1});
assert.equal(2, qt.config.maxDepth);
assert.equal(1, qt.config.maxFill);

//because [] == [] returns false!?
var res = qt.query([0, 0]);
assert.equal('object', typeof res);
assert.equal(0,        res.length);

var res = qt.queryBounds([0, 0], [512, 512]);
assert.equal('object', typeof res);
assert.equal(0,        res.length);

assert.equal(qt, qt.queryQuad([0, 0]));

var obj = {foo: 'bar'};
assert.equal(true, qt.insert([5, 5], {foo: 'bar'}));
assert.equal(false, qt.insert([-5, -5], {foo: null}));

assert.equal(true, qt.insert([300, 300], {foo: 'bar'}));
assert.equal(true, qt.insert([350, 350], {foo: 'bar'}));

var res = qt.query([0, 0]);
assert.deepEqual([{key: [5, 5], value: obj}], res);
assert.equal(1,     res.length);

var res = qt.query([275, 275]);
assert.deepEqual([{key: [300, 300], value: obj}, {key: [350, 350], value: obj}], res);
assert.equal(2,     res.length);

var res = qt.queryBounds([0, 0], [10, 10]);
assert.deepEqual([{key: [5, 5], value: obj}], res);
assert.equal(1,     res.length);



console.log(qt);

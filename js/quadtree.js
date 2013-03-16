/*!
* quadtree.js: a JavaScript QuadTree implementation
* https://github.com/etlgfx/jsquadtree
* License MIT (c) Eric Liang <etlgfx>
*/
(function (name, definition) {
	if (typeof define == 'function') //we're probably using require.js or similar
		define(definition);
	else if (typeof module != 'undefined') //we're probably using node.js
		module.exports = definition();
	else //we're probably loading this directly in browser so assign the result to this (ie. window)
		this[name] = definition();
})('quadtree', function () {
	/**
	 * constructor
	 *
	 * @param Array topleft [x, y]
	 * @param Array bottomright [x, y]
	 * @param int depth - depth of current QuadTree instance default 0, don't set this manually
	 */
	function QuadTree(topleft, bottomright, depth) {
		this.bounds = topleft.concat(bottomright); //[tl.x, tl.y, br.x, br.y] / [left, top, right, bottom]
		this.depth = depth === undefined ? 0 : depth;

		this.objects = [];
		this.children = null;
	}

	QuadTree.maxFill = 2;
	QuadTree.maxDepth = 6;

	/**
	 * return all points inside the same box as point
	 *
	 * @param Array point [x, y]
	 *
	 * @return Array of objects
	 */
	QuadTree.prototype.query = function(point) {
		if (!this.boundsCheck(point)) {
			return [];
		}

		if (this.children === null) {
			return this.objects;
		}

		var result = [];

		this.children.forEach(function (c) {
			result = result.concat(c.query(point));
		});

		return result;
	};

	/**
	 * search or all objects inside the QuadTree within the given bounds. This
	 * method assumes topleft and bottomright to be in their correct respective
	 * orders
	 *
	 * @param Array topleft [x, y]
	 * @param Array bottomright [x, y]
	 *
	 * @return Array of objects
	 */
	QuadTree.prototype.queryBounds = function(topleft, bottomright) {
		if (this.bounds[2] < topleft[0] || bottomright[0] < this.bounds[0] ||
			this.bounds[3] < topleft[1] || bottomright[1] < this.bounds[1]) {
			return [];
		}

		var result = [];

		if (this.children === null) {
			this.objects.forEach(function (o) {
				if (o.key[0] >= topleft[0] && o.key[0] <= bottomright[0] &&
					o.key[1] >= topleft[1] && o.key[1] <= bottomright[1]) {
					result.push(o);
				}
			});
		}
		else {
			this.children.forEach(function (c) {
				result = result.concat(c.queryBounds(topleft, bottomright));
			});
		}

		return result;
	};

	/**
	 * insert a new object into the QuadTree, if necessary subdivide the
	 * current Quad depending on the maxFill and maxDepth config options
	 *
	 * @param Array point [x, y]
	 * @param Object obj - anything you want to insert
	 *
	 * @return bool - true if the object was inserted, false if the object was outside
	 * the bounds
	 */
	QuadTree.prototype.insert = function(point, obj) {
		if (!this.boundsCheck(point)) {
			return false;
		}

		if (this.children === null && (this.objects.length < QuadTree.maxFill || this.depth >= QuadTree.maxDepth)) {
			this.objects.push({key: point, value: obj});
			return true;
		}

		if (this.children === null) {
			this.subdivide();
		}

		if (this.children[0].insert(point, obj)) return true;
		if (this.children[1].insert(point, obj)) return true;
		if (this.children[2].insert(point, obj)) return true;
		if (this.children[3].insert(point, obj)) return true;

		return false;
	};

	/**
	 * check if the given point is within the bounds of the current Quad
	 *
	 * @param Array point [x, y]
	 *
	 * return bool
	 */
	QuadTree.prototype.boundsCheck = function(point) {
		if (!point || point === undefined)
			return false;

		if (point[0] < this.bounds[0]) return false;
		if (point[0] >= this.bounds[2]) return false;
		if (point[1] < this.bounds[1]) return false;
		if (point[1] >= this.bounds[3]) return false;

		return true;
	};

	/**
	 * subdivide the QuadTree instance. If there are objects inside the current
	 * Quad, they will be distributed over the resulting child Quads
	 */
	QuadTree.prototype.subdivide = function() {
		var size = (this.bounds[2] - this.bounds[0]) / 2;

		this.children = [
			new QuadTree(
				[this.bounds[0], this.bounds[1]],
				[this.bounds[0] + size, this.bounds[1] + size],
				this.depth + 1),
			new QuadTree(
				[this.bounds[0] + size, this.bounds[1]],
				[this.bounds[2], this.bounds[1] + size],
				this.depth + 1),
			new QuadTree(
				[this.bounds[0], this.bounds[1] + size],
				[this.bounds[0] + size, this.bounds[3]],
				this.depth + 1),
			new QuadTree(
				[this.bounds[0] + size, this.bounds[1] + size],
				[this.bounds[2], this.bounds[3]],
				this.depth + 1)
		];

		this.objects.splice(0, QuadTree.maxFill).forEach(function (o) {
			this.children.forEach(function (c) {
				c.insert(o.key, o.value);
			});
		}, this);
	};

	/**
	 * constructor
	 */
	QuadTreeArray = function(size) {
		this.size = size;
		this.quads = null;
	};

	/**
	 */
	QuadTreeArray.prototype.insert = function(point, obj) {};

	/**
	 */
	QuadTreeArray.prototype.query = function(point, obj) {};

	/**
	 */
	QuadTreeArray.prototype.queryBounds = function(point, obj) {};

	return QuadTree;
});

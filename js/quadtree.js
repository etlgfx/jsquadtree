define(function (require, exports, module) {
	function QuadTree(topleft, bottomright) {
		this.bounds = topleft.concat(bottomright); //[tl.x, tl.y, br.x, br.y] / [left, top, right, bottom]

		this.objects = [];
		this.children = null;
	}

	QuadTree.maxFill = 2;
	QuadTree.maxDepth = 6;

	//return all points inside the same box as point
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

	QuadTree.prototype.insert = function(point, obj) {
		if (!this.boundsCheck(point)) {
			return false;
		}

		if (this.children === null && this.objects.length < QuadTree.maxFill) {
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

	QuadTree.prototype.boundsCheck = function(point) {
		if (!point || point === undefined)
			return false;

		if (point[0] < this.bounds[0]) return false;
		if (point[0] >= this.bounds[2]) return false;
		if (point[1] < this.bounds[1]) return false;
		if (point[1] >= this.bounds[3]) return false;

		return true;
	};

	QuadTree.prototype.subdivide = function() {
		var size = (this.bounds[2] - this.bounds[0]) / 2;

		this.children = [
			new QuadTree(
				[this.bounds[0], this.bounds[1]],
				[this.bounds[0] + size, this.bounds[1] + size]),
			new QuadTree(
				[this.bounds[0] + size, this.bounds[1]],
				[this.bounds[2], this.bounds[1] + size]),
			new QuadTree(
				[this.bounds[0], this.bounds[1] + size],
				[this.bounds[0] + size, this.bounds[3]]),
			new QuadTree(
				[this.bounds[0] + size, this.bounds[1] + size],
				[this.bounds[2], this.bounds[3]])
		];

		this.objects.splice(0, QuadTree.maxFill).forEach(function (o) {
			this.children.forEach(function (c) {
				c.insert(o.key, o.value);
			});
		}, this);
	};

	return QuadTree;
});

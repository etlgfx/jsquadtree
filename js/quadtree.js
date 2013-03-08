define(function (require, exports, module) {
	function QuadTree(bounds) {
		this.bounds = bounds;

		this.objects = [];
		this.children = null;
	}

	QuadTree.maxFill = 2;

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
			result.concat(c.query(point));
		});

		return result;
	};

	/*
	QuadTree.prototype.queryBounds = function(bounds) {
	};
	*/

	QuadTree.prototype.insert = function(obj) {
		if (!this.boundsCheck(obj.coords)) {
			return false;
		}

		if (this.children === null && this.objects.length < QuadTree.maxFill) {
			this.objects.push(obj);
			return true;
		}

		if (this.children === null) {
			this.subdivide();
		}

		if (this.children[0].insert(obj)) return true;
		if (this.children[1].insert(obj)) return true;
		if (this.children[2].insert(obj)) return true;
		if (this.children[3].insert(obj)) return true;

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
			new QuadTree([this.bounds[0], this.bounds[1], this.bounds[0] + size, this.bounds[1] + size]),
			new QuadTree([this.bounds[0] + size, this.bounds[1], this.bounds[2], this.bounds[1] + size]),
			new QuadTree([this.bounds[0], this.bounds[1] + size, this.bounds[0] + size, this.bounds[3]]),
			new QuadTree([this.bounds[0] + size, this.bounds[1] + size, this.bounds[2], this.bounds[3]])
		];

		this.objects.splice(0, QuadTree.maxFill).forEach(function (o) {
			this.children.forEach(function (c) {
				c.insert(o);
			});
		}, this);
	};

	return QuadTree;
});

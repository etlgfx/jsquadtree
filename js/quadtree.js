var qt = (function () {
	var canvas, context;
	var ts = null;
	var start_ts = null;

	var qt = null;

	function Obj(coords) {
		this.coords = coords;
	}

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

		if (this.objects.length < QuadTree.maxFill) {
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
				c.insert.call(c, o);
			});
		}, this);
	};


	function init(id) {
		canvas = document.getElementById(id);
		canvas.width = 512;
		canvas.height = 512;
        context = canvas.getContext('2d');

		(function() {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;
		})();

		qt = new QuadTree([0, 0, 512, 512]);

		window.addEventListener('click', function (evt) {
			qt.insert(new Obj([evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop]));

			context.clearRect(
				0, 0,
				canvas.width, canvas.height);

			drawQuadTree(qt);
		}, true);

		//requestAnimationFrame(setupTimer);
		qt.subdivide();
		qt.children[1].subdivide();
		console.log(qt);
		drawQuadTree(qt);
	}

	/*
	function setupTimer(newts) {
		ts = newts;
		start_ts = newts;

		requestAnimationFrame(draw);
	}
	*/

	function drawQuadTree(qt) {
		context.strokeRect(qt.bounds[0], qt.bounds[1], qt.bounds[2], qt.bounds[3]);

		/*
		qt.objects.forEach(function (o) {
			context.beginPath();
			context.arc(o.coords[0], o.coords[1], 3, 0, Math.PI * 2, true);
			context.closePath();

			context.fill();
		});
		*/

		if (qt.children) {
			qt.children.forEach(drawQuadTree);
		}
	}

	/*
	function draw(newts) {
		var frame_ts = (newts - ts) / 1000;
		var elapsed_ts = (newts - start_ts) / 1000;
		ts = newts;

        context.clearRect(
			0, 0,
			canvas.width, canvas.height);

		drawQuadTree(qt);

		requestAnimationFrame(draw);
	}
	*/

	return {
		'init': init,
	};
})();

qt.init('canvas');

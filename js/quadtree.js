var qt = (function () {
	var canvas, context;
	var ts = null;
	var start_ts = null;

	function QuadTree() {
	}

	QuadTree.prototype.query = function(point) {
	};

	QuadTree.prototype.queryBB = function(point1, point2) {
	};

	QuadTree.prototype.insert = function(obj) {
	};

	QuadTree.prototype.subdivide = function() {
	};


	function init(id) {
		canvas = document.getElementById(id);
        context = canvas.getContext('2d');

		(function() {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;
		})();

		window.addEventListener('click', function (evt) {
			mouse[0] = evt.clientX - canvas.offsetLeft;
			mouse[1] = evt.clientY - canvas.offsetTop;
		}, true);

		requestAnimationFrame(setupTimer);
	}

	function setupTimer(newts) {
		ts = newts;
		start_ts = newts;

		requestAnimationFrame(draw);
	}

	function draw(newts) {
		var frame_ts = (newts - ts) / 1000;
		var elapsed_ts = (newts - start_ts) / 1000;
		ts = newts;

        context.clearRect(
			0, 0,
			canvas.width, canvas.height);

		//dangles[0].draw(context, frame_ts, elapsed_ts);
		dangles.forEach(function (d) {
			d.draw(context, frame_ts, elapsed_ts);
		});

		requestAnimationFrame(draw);
	}

	return {
		'init': init,
	};
})();

qt.init('canvas');

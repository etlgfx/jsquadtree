require.config({
	baseUrl: 'js',
});

require(['quadtree'], function (QuadTree) {
	var canvas, context;
	var ts = null;
	var start_ts = null;

	var qt = null;

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
			qt.insert({coords: [evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop]});

			context.clearRect(
				0, 0,
				canvas.width, canvas.height);

			drawQuadTree(qt);
		}, true);

		//requestAnimationFrame(setupTimer);
		drawQuadTree(qt);
	}

	function drawQuadTree(qt) {
		context.strokeRect(qt.bounds[0], qt.bounds[1], qt.bounds[2] - qt.bounds[0], qt.bounds[3] - qt.bounds[1]);

		qt.objects.forEach(function (o) {
			context.beginPath();
			context.arc(o.coords[0], o.coords[1], 2, 0, Math.PI * 2, true);
			context.closePath();

			context.fill();
		});

		if (qt.children) {
			qt.children.forEach(drawQuadTree);
		}
	}

	init('canvas');
});

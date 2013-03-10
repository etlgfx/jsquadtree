require.config({
	baseUrl: 'js',
});

require(['quadtree'], function (QuadTree) {
	var canvas, context;
	var ts = null;
	var start_ts = null;

	var qt = null;
	var selection = null;

	function fixBounds(point1, point2) {
		if (point1[0] > point2[0]) {
			var t = point1[0];
			point1[0] = point2[0];
			point2[0] = t;
		}

		if (point1[1] > point2[1]) {
			var t = point1[1];
			point1[1] = point2[1];
			point2[1] = t;
		}
	}

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

		qt = new QuadTree([0, 0], [512, 512]);

		window.addEventListener('contextmenu', function (evt) {
			evt.preventDefault();
		}, true);

		var mouseStart = null;
		var mouseDown = false;
		var mouseRange = false;
		var selectionDiv = document.getElementById('selection');

		window.addEventListener('mousedown', function (evt) {
			evt.preventDefault();

			if (evt.which == 1) {
				mouseStart = [evt.clientX, evt.clientY];
				mouseDown = true;
			}
		}, true);

		window.addEventListener('mousemove', function (evt) {
			evt.preventDefault();
			if (mouseDown) {
				mouseRange = true;
				var tl = mouseStart.slice(0);
				var br = [evt.clientX, evt.clientY];

				fixBounds(tl, br);

				selectionDiv.style.display = 'block';
				selectionDiv.style.top = tl[1] +'px';
				selectionDiv.style.left = tl[0] +'px';
				selectionDiv.style.width = (br[0] - tl[0]) +'px';
				selectionDiv.style.height = (br[1] - tl[1]) +'px';
			}
		}, true);

		window.addEventListener('mouseup', function (evt) {
			var coords = [evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop];
			evt.preventDefault();

			switch (evt.which) {
				case 1: //left click
					if (mouseRange) {
						var tl = [mouseStart[0] - canvas.offsetLeft, mouseStart[1] - canvas.offsetTop];
						var br = coords.slice(0);

						fixBounds(tl, br);

						selection = qt.queryBounds(tl, br);
					}
					else {
						qt.insert(coords, {});
					}
					break;
				case 3: //right click
					selection = qt.query(coords);
					break;
			}

			context.clearRect(
				0, 0,
				canvas.width, canvas.height);

			drawQuadTree(qt);
			mouseStart = null;
			mouseDown = false;
			mouseRange = false;
			selectionDiv.style.display = 'none';
		}, true);

		//requestAnimationFrame(setupTimer);
		drawQuadTree(qt);
	}

	function drawQuadTree(qt) {
		context.strokeRect(qt.bounds[0], qt.bounds[1], qt.bounds[2] - qt.bounds[0], qt.bounds[3] - qt.bounds[1]);

		qt.objects.forEach(function (o) {
			context.beginPath();
			context.arc(o.key[0], o.key[1], 2, 0, Math.PI * 2, true);
			context.closePath();

			var selected = false;

			if (selection) {
				selection.forEach(function (s) {
					if (s.key === o.key)
						selected = true;
				});
			}

			if (selected)
				context.fill();
			else
				context.stroke();
		});

		if (qt.children) {
			qt.children.forEach(drawQuadTree);
		}
	}

	init('canvas');
});

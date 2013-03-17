jsquadtree
==========
Implementation of a QuadTree in JavaScript

View the [demo here](http://experiments.etlgfx.com/jsquadtree)!

Usage
---
Include the script any way you like, in browser or node.js.

Using `<script>`:

	<script type="text/javascript" src="quadtree.js"></script>

Using `require.js`:

	require(['quadtree'], function (QuadTree) {});

Using `node.js`:

	var QuadTree = require('quadtree');

Now that the QuadTree object is in scope you can instantiate a new QuadTree by simply doing:

	var qt = new QuadTree({x: 0, y: 0, size: 512});

Inserting objects into the QuadTree is simple:

	qt.insert([x, y], {the object});

You can insert anything you like! And then retrive it again in two ways:

	qt.query([x, y]);
	qt.queryBounds([x1, y1], [x2, y2]);

The `query` method will return an Array of all objects in the Quad that
contains the coordinates specified.
The `queryBounds` method will return an Array of all objects in the QuadTree
within the given coordinate bounds.

Note
---
You must specify the coordinates in topleft [x, y], bottomright [x, y] order.
Unpredicted behavior will probably happen if you don't.

See the `fixBounds()` in `js/main.js` to see how to deal with this easily. I
didn't include it in quadtree.js as I felt it shouldn't be part of the module
itself.

var COLORS = {
	RED: '#FF0000',
	YELLOW: '#FFFF00',
	BLUE: '#0000FF',
	BLACK: '#000000'
};


var CanvasDraw = function(canvasID, top) {
	this.canvasTop = top;// Position of menu

	this.canvas = document.getElementById(canvasID);
	
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight - this.canvasTop;

	this.context = this.canvas.getContext('2d');
	this.Parallelogram = {};

	//Parameters
	this.dragStarted = false;
	this.whichPointDrag = -1;
	this.pointsOfParallelogram = [];

	// Prevent text select outside canvas
	this.canvas.onselectstart = function () { return false; };
	//Events
	this.canvas.addEventListener('mousedown', this.touchStart.bind(this), false);
	this.canvas.addEventListener('mousemove', this.touchMove.bind(this), false);
	this.canvas.addEventListener('mouseup', this.touchEnd.bind(this), false);
	this.canvas.addEventListener('mouseout', this.touchReset.bind(this), false);


	this.canvas.addEventListener('touchstart', this.touchStart.bind(this), false);
	this.canvas.addEventListener('touchmove', this.touchMove.bind(this), false);
	this.canvas.addEventListener('touchend', this.touchEnd.bind(this), false);	

	window.addEventListener('resize', this.resizeCanvas.bind(this), false);

	Log.text('Insert 3 points');


};
CanvasDraw.prototype.reset = function() {
	this.dragStarted = false;
	this.pointsOfParallelogram = [];

	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	Log.text('Insert 3 points');
};
CanvasDraw.prototype.movePoint = function(x, y) {

	var pointsOfParallelogramTemp = [];
	for (var i = 0; i < 3; i++) {
		if (i === this.whichPointDrag) {
			this.pointsOfParallelogram[i].x = x;
			this.pointsOfParallelogram[i].y = y;
		}
		pointsOfParallelogramTemp.push(this.pointsOfParallelogram[i]);
	}

	// Clear
	this.pointsOfParallelogram = [];
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw
	for (var i2 = 0; i2 < 3; i2++) {
		this.addPointOfParallelogram(pointsOfParallelogramTemp[i2]);
	}

	this.Parallelogram = new Parallelogram(this.pointsOfParallelogram);

	// Draw Parallelogram 
	this.drawParallelogram(this.pointsOfParallelogram, COLORS.BLUE, true);
};


// Resize Canvas
CanvasDraw.prototype.resizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight - this.canvasTop;

	//Refresh canvas
	
	if (this.pointsOfParallelogram && this.pointsOfParallelogram[0]) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.whichPointDrag = 0;
		this.movePoint(this.pointsOfParallelogram[0].x, this.pointsOfParallelogram[0].y);
		this.whichPointDrag = -1;
	} else {
		this.reset();
	}
	
};

// Draw Circle
CanvasDraw.prototype.drawCircle = function(x, y, radius, color, lineWidth) {
	if (!lineWidth) lineWidth = 1;
	this.context.beginPath();
	this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
	this.context.closePath();
	this.context.lineWidth = lineWidth;
	this.context.strokeStyle = color;
	this.context.stroke();
};
CanvasDraw.prototype.drawParallelogram = function(points, color, noOrderPoints) {
	
	var fourthPoint = this.Parallelogram.getFourthPoint({
		width: this.canvas.width,
		height: this.canvas.height
	}, noOrderPoints);
	// // Change the order of the array points
	this.pointsOfParallelogram = this.Parallelogram.points;
	this.pointsOfParallelogram[3] = fourthPoint;

	this.context.beginPath();

	var parallelogramArea = this.Parallelogram.getArea(),
	parallelogramPerimeter = this.Parallelogram.getPerimeter();

	// Calc center point of parallelogram
	var centerPoint = {
		x: (points[0].x + fourthPoint.x) / 2,
		y: (points[0].y + fourthPoint.y) / 2
	};
	var centerMass = this.Parallelogram.getCenterMass();

	// Draw Circle inside Parallelogram
	var circleRadius = 0;
	//Found Circle Radius
	//console.log('Circle');
	// for (var i = 0; i < 4; i++) {
	// 	var rect = this.Parallelogram.getRects()[i],
	// 		distance = rect.getDistanceOfPoint(centerPoint);
	// 		//console.log('D',i,distance);
	// 	if (i === 0 || circleRadius > distance) {
	// 		circleRadius = distance;
	// 	}
	// }

	circleRadius = Math.sqrt(parallelogramArea/Math.PI);

	this.drawCircle(centerMass.x, centerMass.y, circleRadius, COLORS.YELLOW, 2);
	this.drawCircle(centerMass.x, centerMass.y, 1, COLORS.BLUE, 1);

	this.drawCircle(fourthPoint.x, fourthPoint.	y, 1, COLORS.BLACK);
	this.context.moveTo(points[0].x, points[0].y);
	this.context.lineTo(points[0].x, points[0].y);
	this.context.lineTo(points[1].x, points[1].y);
	this.context.lineTo(points[3].x, points[3].y);
	this.context.lineTo(points[2].x, points[2].y);
	this.context.lineTo(points[0].x, points[0].y);

	this.context.closePath();
	this.context.lineWidth = 1;
	this.context.strokeStyle = color;
	this.context.stroke();

	//SHOW INFO
	var info = 'Parallelogram & Circle:  Area = ' + parseFloat(parallelogramArea).toFixed(2) + 'px';
		// info += ' | Perimeter = ' + parseFloat(parallelogramPerimeter).toFixed(2);
		// info += ' | Height = ' + parseFloat(this.Parallelogram.getHeight()).toFixed(2);
		// info += ' | Base = ' + parseFloat(this.Parallelogram.getBase()).toFixed(2);
		// info += ' | Oblique Side = ' + parseFloat(this.Parallelogram.getObliqueSide()).toFixed(2);

	Log.text(info);

};
// Point for Parallelogram
CanvasDraw.prototype.addPointOfParallelogram = function(point) {
	this.pointsOfParallelogram.push(point);

	//Draw Circle
	this.drawCircle(point.x, point.y, 11, COLORS.RED);
	this.drawCircle(point.x, point.y, 1, COLORS.RED);
};

/*
 * Events Listener - Drag & Click
 */
CanvasDraw.prototype.touchStart = function(e) {
	this.dragStarted = true;
	var x = e.pageX - this.canvas.offsetLeft,
		y = e.pageY - this.canvas.offsetTop;
	if (this.pointsOfParallelogram.length === 4) {
		//Drag point
		for (var i = 0;  i < 3; i++) {
			var pointNow = this.pointsOfParallelogram[i];
			if((Math.pow(x - pointNow.x, 2) + Math.pow(y - pointNow.y, 2)) < Math.pow(11, 2)) {
				// Yes inside and drag this point
				this.whichPointDrag = i;
				break;
			}
		}
	}
};
CanvasDraw.prototype.touchMove = function(e) {
	if (!this.dragStarted || this.whichPointDrag < 0) return;

	var x = e.pageX - this.canvas.offsetLeft,
		y = e.pageY - this.canvas.offsetTop;

	this.movePoint(x, y);
};
CanvasDraw.prototype.touchEnd = function(e) {
	this.dragStarted = false;

	var x = e.pageX - this.canvas.offsetLeft,
		y = e.pageY - this.canvas.offsetTop;
	if (this.pointsOfParallelogram.length < 3) {

		//FIXME
		// if (!this.pointsOfParallelogram.length) {
		// 	//Point 0
		// 	x = 200;
		// 	y = 200;
		// } else if (this.pointsOfParallelogram.length == 1) {
		// 	//Point 1
		// 	x = 400;
		// 	y = 200;
		// } if (this.pointsOfParallelogram.length == 2) {
		// 	//Point 3
		// 	x = 200;
		// 	y = 400;
		// }
		// if (!this.pointsOfParallelogram.length) {
		// 	//Point 0
		// 	x = 353;
		// 	y = 379;
		// } else if (this.pointsOfParallelogram.length == 1) {
		// 	//Point 1
		// 	x = 635;
		// 	y = 377;
		// } if (this.pointsOfParallelogram.length == 2) {
		// 	//Point 3
		// 	x = 456;
		// 	y = 216;
		// }
		// if (!this.pointsOfParallelogram.length) {
		// 	//Point 0
		// 	x = 348;
		// 	y = 379;
		// } else if (this.pointsOfParallelogram.length == 1) {
		// 	//Point 1
		// 	x = 348;
		// 	y = 670;
		// } if (this.pointsOfParallelogram.length == 2) {
		// 	//Point 3
		// 	x = 649;
		// 	y = 82;
		// }

		this.addPointOfParallelogram({
			x: x,
			y: y
		});

		var numberPointsToInsert = 3 - this.pointsOfParallelogram.length;
		if (numberPointsToInsert > 0) {
			Log.text('Insert ' + numberPointsToInsert + ' point' + (numberPointsToInsert===1?'':'s'));
		} else {
			Log.text('');
			this.Parallelogram = new Parallelogram(this.pointsOfParallelogram);
			// Draw Parallelogram 
			this.drawParallelogram(this.pointsOfParallelogram, COLORS.BLUE);
		}
	} else {
		this.movePoint(x, y);
		this.whichPointDrag = -1;
	}
};
CanvasDraw.prototype.touchReset = function() {
	this.dragStarted = false;
	this.whichPointDrag = -1;
};
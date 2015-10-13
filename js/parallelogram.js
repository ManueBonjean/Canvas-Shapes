var Parallelogram = function(points) {
	this.points = points;
	this.rects = [];

	this.rects[0] = new Rect(points[0], points[1]);
	this.rects[1] = new Rect(points[0], points[2]);
};
Parallelogram.prototype.getPoints = function() {
	return this.points;
};
Parallelogram.prototype.getMinorDistancePoints = function() {
	var firstDistance = Math.sqrt(
		Math.pow((this.points[3].x - this.points[0].x), 2) + Math.pow((this.points[3].y - this.points[0].y), 2)
	);
	var secondDistance = Math.sqrt(
		Math.pow((this.points[2].x - this.points[1].x), 2) + Math.pow((this.points[2].y - this.points[1].y), 2)
	);

	return (firstDistance<secondDistance?firstDistance:secondDistance);
};
Parallelogram.prototype.getBase = function() {
	return Math.sqrt(
		Math.pow((this.points[1].x - this.points[0].x), 2) + Math.pow((this.points[1].y - this.points[0].y), 2)
	);
};
Parallelogram.prototype.getObliqueSide = function() {
	return Math.sqrt(
		Math.pow((this.points[3].x - this.points[0].x), 2) + Math.pow((this.points[3].y - this.points[0].y), 2)
	);
};
Parallelogram.prototype.getHeight = function() {
	var r = new Rect(this.points[1], this.points[0]);
	return r.getDistanceOfPoint(this.points[2]);
};
Parallelogram.prototype.getCenterMass = function() {
	var rect1 = new Rect(this.points[0], this.points[3]),
		rect2 = new Rect(this.points[1], this.points[2]);

	var centerMass = {
		x: 0,
		y: 0
	};

	if (rect1.getM() !== 'no' && rect2.getM() !== 'no') {
		centerMass.x = ((rect2.getQ() - rect1.getQ()) / (rect1.getM() - rect2.getM()));
	} else if (rect1.getM() !== -1 || rect2.getM() !== -1) {
		if (rect2.getM() !== 'no') {
			centerMass.x = rect1.getPoints()[0].x;
		} else {
			centerMass.x = rect2.getPoints()[0].x;
		}
	} else {
		console.error('Not Parallelogram');
	}

	centerMass.y = (rect1.getM() * centerMass.x) + rect1.getQ();

	return centerMass;
};

// Get rects of segments
Parallelogram.prototype.getRects = function() {
	return this.rects;
};
Parallelogram.prototype.getPerimeter = function() {
	return (this.getBase() * 2) + (this.getObliqueSide() * 2);
};
Parallelogram.prototype.getArea = function() {
 	return this.getBase() * this.getHeight();
};
Parallelogram.prototype.getFourthPoint = function(canvasSize, notOrderPoints) {
	var point1, point2, point3;
	point1 = this.points[0];
	point2 = this.points[1];
	point3 = this.points[2];

	var fourthPoint = {
		x: 0,
		y: 0
	};

	fourthPoint.x = point3.x + point2.x - point1.x;
	fourthPoint.y = point3.y + point2.y - point1.y;
	if (!notOrderPoints) {
		if (fourthPoint.x < 0 || fourthPoint.x > canvasSize.width || fourthPoint.y < 0 || fourthPoint.y > canvasSize.height) {
			//outside canvas area
			console.log('Parallelogram outside of area 1');

			fourthPoint.x = point2.x + point1.x - point3.x;
			fourthPoint.y = point2.y + point1.y - point3.y;

			if (fourthPoint.x < 0 || fourthPoint.x > canvasSize.width || fourthPoint.y < 0 || fourthPoint.y > canvasSize.height) {
				//outside canvas area
				console.log('Parallelogram outside of area 2');

				fourthPoint.x = point1.x + point3.x - point2.x;
				fourthPoint.y = point1.y + point3.y - point2.y;
				if (fourthPoint.x < 0 || fourthPoint.x > canvasSize.width || fourthPoint.y < 0 || fourthPoint.y > canvasSize.height) {
					//outside canvas area
					console.log('Parallelogram outside of area 3');
					fourthPoint.x = point3.x + point2.x - point1.x;
					fourthPoint.y = point3.y + point2.y - point1.y;

				} else {
					// Change the order of the array points
					this.points[0] = point2;
					this.points[1] = point3;
					this.points[2] = point1;
				} 
			} else {
				// Change the order of the array points
				this.points[0] = point3;
				this.points[1] = point1;
				this.points[2] = point2;
			}
		}
	}
	
	this.points[3] = fourthPoint;

	// Get Rects
	this.rects[2] = new Rect(point2, fourthPoint);
	this.rects[3] = new Rect(point3, fourthPoint);

	return fourthPoint;
};
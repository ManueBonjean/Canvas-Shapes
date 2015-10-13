var Rect = function(point1, point2) {
	this.points = [
		point1,
		point2
	];

	if (point1.x !== point2.x) {
		this.m = ((point2.y - point1.y)/(point2.x - point1.x));
		this.q = (-this.m * point1.x ) + point1.y;
	} else {
		this.m = 'no';
	}
};
Rect.prototype.getDistanceOfPoint = function(point) {
	if (this.m !== 'no') {
		return Math.abs((point.y - (this.m * point.x) - this.q) / Math.sqrt(1 + Math.pow(this.m, 2)));
	} else {
		return Math.abs(this.points[0].x - point.x);
	}
};

Rect.prototype.getA = function() {
	return this.a;
};
Rect.prototype.setA = function(a) {
	this.a = a;
};
Rect.prototype.getB = function() {
	return this.b;
};
Rect.prototype.setB = function(b) {
	this.b = b;
};
Rect.prototype.getC = function() {
	return this.c;
};
Rect.prototype.setC = function(c) {
	this.c = c;
};

Rect.prototype.getM = function() {
	return this.m;
};
Rect.prototype.setM = function(m) {
	this.m = m;
};
Rect.prototype.getQ = function() {
	return this.q;
};
Rect.prototype.setQ = function(q) {
	this.q = q;
};

Rect.prototype.getPoints = function() {
	return this.points;
};
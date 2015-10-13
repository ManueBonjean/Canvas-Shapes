// ELEMENT
var aboutElement = document.getElementById('about'),
	informationsText = document.getElementById('informations-text'),
	canvas;


var Log = {
	text: function(text) {
		informationsText.innerText = text;
	},
	append: function(text) {
		informationsText.innerText += ' | ' + text;
	}
};
var showAbout = function() {
	aboutElement.style.display = 'block';
};
var closeAbout = function() {
	aboutElement.style.display = 'none';
};
var resetCanvas = function() {
	canvas.reset();
};

/*
 * INIT
 */
	// Canvas
	canvas = new CanvasDraw('canvas', 60);
	// Hide Loading
	document.getElementById('loading').style.display = 'none';
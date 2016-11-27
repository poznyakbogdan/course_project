$(document).ready(function() {
    var canvas = document.getElementById("draw_area");
    var context = canvas.getContext("2d");

 //    ctx.fillRect(0, 0, 30, 30); 
 //    ctx.strokeRect(40, 0, 30, 30);
 //    ctx.beginPath();  
	// ctx.moveTo(00, 00);  
	// ctx.lineTo(50, 250);  
	// ctx.lineTo(250, 250);  
	// ctx.closePath();  
	// ctx.fill();  

	function inRad(num) {
		return num * Math.PI / 180;
	}

	context.translate(400, 300);
	function drawLine (x0,y0, angle, color) {
		context.rotate(inRad(angle));
		// context.translate(0, 0);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = color;
		context.moveTo(0, 0);
		context.lineTo(x0, y0);
		context.stroke();
		context.closePath();
	}
	for (var i = 0; i <= 5; i++) {
		drawLine(200, 200, i, 'red');	
		//drawLine(100,100, i, 'red');	
	}	
	// drawLine(10,10, 0, 'red');
	// drawLine(30,30, 90, 'black');
	// context.moveTo(10, 10);
	// 	context.lineTo(50, 50);
	// 	context.stroke();
// 	context.translate(50.5, 50.5);
// 	context.scale(0.5, 0.5);
// // Рисуем 10 квадратов
// 	var copies = 10;
// 	for (var i=1; i<copies; i++) {

// 	    context.rotate(2 * Math.PI * 1/(copies-1));

// 	    // Рисуем квадрат
// 	    context.rect(0.5, 0.5, 60, 60);
// 	  }
// 	context.strokeStyle = "#109bfc";
// 	context.stroke();
});

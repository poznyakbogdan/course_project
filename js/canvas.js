function inRad(num) {
		return num * Math.PI / 180;
}
	var canvas = document.getElementById("draw_area");
    var ctx = canvas.getContext("2d");
    

	function draw_elem (array) {
		if (array[4] >= 1) {
			draw_line(array[5], array[6], array[9]);	
			if (array[4] > 1) {
				draw_bus(array, array[9]);				
			}
		}else if (array[4] == 0) {
			draw_transformer(array[5], array[6], array[9]);
		}
	}

	function draw_bus(array, angle){
		var l = (array[4] - 1) * 50;

		ctx.translate(array[7], array[8]);
		ctx.rotate(inRad(angle));		
		
		ctx.fillRect(0, -4, l, 8);

		ctx.rotate(-(inRad(angle)));
		ctx.translate(-array[7], -array[8]);

	}

	function draw_line (x0, y0, angle) {
		 var canvas = document.getElementById("draw_area");
    	var ctx = canvas.getContext("2d");

		ctx.translate(x0, y0);
		ctx.rotate(inRad(angle));		
		
		ctx.beginPath();
		ctx.moveTo(0, -5);
		ctx.lineTo(0, 5);

		ctx.moveTo(0, 0);
		ctx.lineTo(130, 0);
		
		ctx.moveTo(130, -5);
		ctx.lineTo(130, 5);
		
		ctx.stroke();
		ctx.closePath();

		ctx.rotate(-(inRad(angle)));
		ctx.translate(-x0, -y0);
		
	}


	function draw_transformer (x0, y0, angle) {
		ctx.translate(x0, y0);
		ctx.rotate(inRad(angle));		
		
		var cx = 60;
		var cy = 0;
		var r = 10;
		ctx.beginPath();
		
		ctx.moveTo(0, -5);
		ctx.lineTo(0, 5);

		ctx.moveTo(0, 0);
		ctx.lineTo(cx - r, 0);
		ctx.stroke(); 
		ctx.closePath();

		ctx.beginPath(); 
		ctx.arc(cx, cy, r, 0, Math.PI*2, false); 
		ctx.closePath();
		ctx.stroke(); 
		
		cx = cx + 10; 

		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.stroke(); 		

		var dl = cx + r;

		ctx.beginPath(); 
		ctx.moveTo(cx + r, 0);
		ctx.lineTo(dl + 50, 0);
		ctx.moveTo(dl + 50, -5);
		ctx.lineTo(dl + 50, 5);
		ctx.stroke(); 
		ctx.closePath();

		ctx.rotate(-(inRad(angle)));
		ctx.translate(-x0, -y0);
	
	}

	function head_line_number(array) {
		ctx.translate(array[5], array[6]);
		
		ctx.textAlign = "center";
 	    ctx.textBaseline = "bottom";
   	    ctx.font = "14pt Arial";
	
		var cords = getCords(array[9]);
		ctx.fillText(array[0], cords[0], cords[1]);
		
		
		ctx.translate(-array[5], -array[6]);
	}

	function text_out (array) {
		ctx.translate(array[7], array[8]);
		ctx.textAlign = "center";
 	    ctx.textBaseline = "bottom";
   	    ctx.font = "14pt Arial";
		var cords = getCords(array[9]);
		ctx.fillText(array[1], cords[0], cords[1]);
		ctx.translate(-array[7], -array[8]);
	}

	function draw_arrow (array) {
		ctx.translate(array[5], array[6]);
		ctx.rotate(inRad(array[9]));		
		
		ctx.beginPath();
		ctx.moveTo(30, -20);
		ctx.lineTo(90, -20);
		
		ctx.moveTo(80, -25);
		ctx.lineTo(90, -20);

		ctx.moveTo(80, -15);
		ctx.lineTo(90, -20);
		
		ctx.stroke();
		ctx.closePath();

		ctx.rotate(-(inRad(array[9])));
		ctx.translate(-array[5], -array[6]);
		
	}

	function show_value (array, value) {
		ctx.translate(array[5], array[6]);
		
		if ( (array[9] + 90) % 360 == 0 ) {
			ctx.textAlign = "right";
		}else {
			ctx.textAlign = "center";			
		}

		//ctx.textAlign = "center";
 	    ctx.textBaseline = "bottom";
   	    ctx.font = "italic 11pt Arial";
		
		var cords = getValueCords(array[9]);
		ctx.fillText(value, cords[0], cords[1]);
		
		ctx.translate(-array[5], -array[6]);	
	}
		
	function getValueCords(angle) {
		var cords = [];
		if (angle == 0) {
			cords[0] = 50;
			cords[1] = -25;
		}else if (angle % 180 == 0) {
			if (angle > 0) {
				cords[0] = -60;
				cords[1] = 45;
			}else{
				cords[0] = 50;
				cords[1] = -25;
			}	
		}else if (angle % 90 == 0) {
			if (angle > 0) {
				cords[0] = 50;
				cords[1] = 70;
			}else{
				cords[0] = -30;
				cords[1] = -55;	
			}	
		}
		return cords;
	}	

	function getCords (angle) {
		var cords = [];
		if (angle == 0) {
			cords[0] = 0;
			cords[1] = -5;
		}else if (angle % 180 == 0) {
			cords[0] = 0;
			cords[1] = -5;
		}else if (angle % 90 == 0) {
			if (angle > 0) {
				cords[0] = -20;
				cords[1] = 5;
			}else{
				cords[0] = 20;
				cords[1] = 5;	
			}	
		}
		return cords;
	}

$(document).ready(function() {

	 ctx.translate(100, 300);
	
});


	function draw_circuit(index){
		var draw_data = get_draw_data();
		push_K(draw_data);
		push_N(draw_data);
	
		draw_data[0].push(0);
		draw_data[0].push(100);
		draw_data[0].push(130);
		draw_data[0].push(100);
		draw_data[0].push(0);

		head_line_number(draw_data[0]);

		for (var i = 0; i < draw_data.length; i++) {
			var x0, y0, angle, dx, dy, xk, yk, l;
			if (draw_data[i][9] == undefined) {
				for (var j = 0; j < draw_data.length; j++) {
					
					if (draw_data[i][2] == j) {
						x0 = draw_data[j][7];
						y0 = draw_data[j][8];
						angle = draw_data[j][9];
						dx = Math.cos(inRad(angle)) * 130;
						dy = Math.sin(inRad(angle)) * 130;
						xk = x0 + dx;
						yk = y0 + dy;
						draw_data[i].push(x0);
						draw_data[i].push(y0);
						draw_data[i].push(xk);
						draw_data[i].push(yk);
						draw_data[i].push(angle);
					}

				}	

			}

			if (draw_data[i][4] > 1) {
					get_bus_data(draw_data, i);	
			}
			draw_elem(draw_data[i]);
			text_out(draw_data[i]);
			draw_arrow(draw_data[i]);
			show_value (draw_data[i], inpData[i][index]);

		}
		console.table(draw_data);

	}


	function get_bus_data(array, index) {
		var n = array[index][4];

		for (var j = 0; j < array.length; j++) {
			var rel_x, rel_y, x0, y0, ang0, angle, dfi, dx, dy, xk, yk;	
			var bus_length_const = 50;	
			if (index == array[j][2]) {
				var k = array[j][3];

				ang0 = array[index][9];

				rel_x = array[index][7];
				rel_y = array[index][8];
				dx = bus_length_const * Math.cos(inRad(ang0)) * k;
				dy = bus_length_const * Math.sin(inRad(ang0)) * k;
				x0 = rel_x + dx;
				y0 = rel_y + dy;

				if (k < n - 1 ) {
					dfi = Math.pow(-1, array[j][3]) * 90;
					angle = ang0 + dfi;	
				}else if (k == n - 1) {
					angle = ang0;
				}
				
				dx = Math.cos(inRad(angle)) * 130;
				dy = Math.sin(inRad(angle)) * 130;
				xk = x0 + dx;
				yk = y0 + dy;

				array[j].push(x0);
				array[j].push(y0);
				array[j].push(xk);
				array[j].push(yk);
				array[j].push(angle);
			}

		}



	}

	function  get_draw_data() {
		 var draw_data = [];
		 for (var i = 0; i < inpData.length; i++) {
		 	draw_data.push([]);
		 	draw_data[i].push(inpData[i][0]);					
		 	draw_data[i].push(inpData[i][1]);				
		 	draw_data[i].push(inpData[i][6]);					
		 }
		 return draw_data;
	}
	
	function push_K (array) {
		for (var i = 0; i < array.length; i++) {
			var k = 0;
			for (var j = 0; j < array.length; j++) {
				if ( (array[i][2] == array[j][2]) && (array[j][3] == undefined)) {
					array[j].push(k);
					k++;
				}
			}
		}
	}

	function push_N (array) {
		for (var i = 0; i < array.length; i++) {
			var n = 0;
			for (var j = 0; j < array.length; j++) {
				if (i == array[j][2]) {
					n++;
				}
			}
			array[i].push(n);
		}
	}

function inRad(num) {
		return num * Math.PI / 180;
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

$(document).ready(function() {
    var canvas = document.getElementById("draw_area");
    var ctx = canvas.getContext("2d");


	function inRad(num) {
		return num * Math.PI / 180;
	}

	ctx.translate(100, 300);
	

	function draw_line (x0, y0, angle) {
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


	// draw_line(0, 0, 0);
	// draw_line(130, 0, 0);
	// draw_line(260, 0, 0);
	// draw_line(390, 0, -30);


	$(".run_width_my_option").click(function () {
		doWithDataOf25Option();
		$('#startProgram').click();
		$('.draw_chart').click();
		
		draw_circuit()
	})

});

	
	function draw_circuit(){
		var draw_data = get_draw_data();
		push_K(draw_data);
		push_N(draw_data);
		console.table(draw_data);
	
		draw_data[0].push(0);
		draw_data[0].push(100);
		draw_data[0].push(130);
		draw_data[0].push(100);
		draw_data[0].push(0);

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

				// if (draw_data[i][4] > 1) {
				// 	get_bus_data(draw_data, i);	
				// }	

			}

			if (draw_data[i][4] > 1) {
					get_bus_data(draw_data, i);	
			}
			draw_line(draw_data[i][5], draw_data[i][6], draw_data[i][9]);

		}

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
		 	draw_data[i].push(inpData[i][0]);					//Nn
		 	draw_data[i].push(inpData[i][1]);					//Nk
		 	draw_data[i].push(inpData[i][6]);					//AO
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







////////////////////////////////////**draw_data**/////////////////////////////////
//0 	начало участка
//1 	конец участка
//2 	AO
//3		K - порядковый номер ветви относительно разветвления 
//4		N - количество ветвей на которые разделяется узел
//5		x0
//6		y0
//7		Xk
//8		Yk
//9		angle
//10 	length of bus

///////////////////////////////////////////////////////////////////////////////////
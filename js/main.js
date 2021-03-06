

var Dlina = [],
	StartOfLine = [],
	EndOfLine = [],
	Snom  = [],
	lineType = [];
$(document).ready( function () {

  $( "#inputDataForm" ).delegate("select[name='lineType']", "change", function (event) {
	  	var elem = event.target;
	  	var lineType = $(elem).find('option:selected');
	  	var text = $(elem).find('option:selected').val();
	  	var parent = $(elem).parent();
	  	if ($(lineType).attr("data-line-type") == "line") {
	  		$(parent).find("div.lineLength").css("display", "inline-block");
	  		$(parent).find("div.wireType").css("display", "inline-block");
	  		$(parent).find("div.nominalPower").css("display", "none");
	  		$(parent).find("div.transformType").css("display", "none");
	  	}else{
	  		$(parent).find("div.nominalPower").css("display", "inline-block");
	  		$(parent).find("div.transformType").css("display", "inline-block");
	  		$(parent).find("div.lineLength").css("display", "none");
	  		$(parent).find("div.wireType").css("display", "none");
	  	}

  });


});


	function addRow () {
		 var insertElem = $('div.rows:nth-child(1)').clone();
		 $(insertElem).find("input").val("");
		 $(insertElem).appendTo("#inputDataForm");
	}


	$('button[href]').click(function(){
		var target = $(this).attr('href');
		$('html, body').animate({scrollTop: $(target).offset().top}, 800);
		return false;
	});

	$('#row_add').click(addRow);
	$('#delete_row').click(function(){
		if ( $('.rows')[1] ){
			$('.rows:last-child').remove();
		}
	});

	$("button[type='reset']").click(function () {
		$('.rows input').val("");
	});


	function doWithDataOf25Option () {
		StartOfLine = [1, 2, 3, 3, 6, 4, 5, 4, 7];
		EndOfLine   = [2, 3, 4, 6, 91, 5, 93, 7, 92];
		Snom        = [0, 0, 0, 0, "TM-100", 0, "TM-630", 0, "TM-63"];	
		lineType    = ["AS-35", "AS-35", "AS-35", "A-35", 7.82 ,"AS-35", 0.85, "AS-35", 35.56]; 
		Dlina       = [2.2, 0.8, 2, 0.5, 0, 0.7, 0, 0.08, 0];	
		// StartOfLine = [7,     9,  5,   11,   14,  1,   3,    6,    2,    4,   12,  14,  5,    12,    5],
		// EndOfLine   = [8,     10, 6,   12,   15,  2,   4,    7,    3,    5,   13,  16,  9,    14,   11],
  // 		Snom        = ["TM-63",   "TM-630", 0,    0,   "TM-100", 0,   0,    0,    0,    0,   "TM-63",  "TM-100", 0,     0,    0],
  // 		//X0        = [1 ,     1, 0.36, 0.36, 1, 0.36, 0.36, 0.36, 0.36, 0.36, 1,   1, 0.36, 0.36,0.36],
 	// 	lineType    = [1 ,     1, "AS-35", "AS-35", 1, "AS-35", "AS-35", "A-35", "A-35", "AS-35", 1,   1, "A-35", "AS-35","A-35"],
	 // 	Dlina       = [0,      0, 1,    1,    0,   1,  1,    1,    1,    1,    0,   0,   1,    1,    1];
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////


	var tableOfTma = [
	[0, 9, 1300],
	[10, 19, 1700],
	[20, 49, 2200],
	[50, 99, 2800],
	[100, 249, 3200],
	[250, 9999999, 3400]
	];
	var transformData = [
	["TM-100", 100, 10.5, 1.97, 5.5, 0.73, 6.5],
	["TM-630", 630, 10.5, 8.5, 5.5, 1.68, 2.0],
	["TM-63", 63, 10.5, 1.28, 4.5, 0.22, 2.8]
	];
	var linesData = [
	["AS-35", 0.79, 0.366, 175],
	["A-35", 0.85, 0.366, 175],
	["AS-25", 1.176, 0.377, 130],
	["A-50", 0.588, 0.355, 210]
	];

	var R0 = [],
		X0 = [];

	var cosfi       = 0.8,
		sinfi       = 0.6,
		k_z         = 0.8,
		Unom        = 10.5,
		T           = 8760,
		U           = roundPlus(Unom * 1.03, 4); 
	var inpData = [];
	var dPLost = [],
		dQLost = [],
		dWLost = [],
		Pgu, Qgu;

//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
	
	function roundPlus(x, n) { //x - число, n - количество знаков
		if(isNaN(x) || isNaN(n)) return false;
		var m = Math.pow(10,n);
		return Math.round(x*m)/m;
	}

	function convertingResistance (array, index, bool) {
		 for (var i = 0; i < array.length; i++) {
		 	var value;
		 	for (var j = 0; j < linesData.length; j++) {
		 		if (array[i] == linesData[j][0]) {
		 			value = linesData[j][index];
		 			break;
		 		}else {
		 			value = 0;
		 		}
		 	}
		 	if (bool == true) {
		 		R0.push(value);
		 	}else {
		 		X0.push(value);	
		 	}
		 }
	}

	function sortingArrayByIncrease (array) {
		var flag;
		var memory = [];
		while (flag != 0) {
		 	flag = 0;
		 	for (var i = 0; i < array.length - 1 ; i++) {
		 		if (array[i][0] > array[i + 1][0]) {
		 			flag = flag + 1;
		 			memory = array[i];
		 			array[i] = array[i + 1];
		 			array[i + 1] = memory;
		 		}
		 	}
		 } 
	}

	function arrayOfAO (array) {
		for (var i = 0; i < array.length; i++) {

		 	for (var j = 0; j < array.length; j++) {
		 		if ( (array[i][1] == array[j][0]) && (i != j) ) {
		 			array[j].push(i);
		 		}
		 	}

		} 
	}

	function floatOfCirciut (array) {
		for (var i = array.length - 1; i >= 0; i--) {
			array[i].push(0);
			array[i].push(0);
			var k = 0;
			for (var j = array.length - 1; j >= 0; j--) {
				if ( i == array[j][6]) {
					array[i][9] = array[i][9] + array[j][9];
					array[i][10] = array[i][10] + array[j][10];
					k++;
				} else if (k == 0) {
					array[i][9] = array[i][7];
					array[i][10] = array[i][8];
				}
			}
		}
	}

	function energyFloat (array) {
		for (var i = array.length - 1; i >= 0; i--) {
			array[i].push(0);
			array[i].push(0);
			var k = 0;
			for (var j = array.length - 1; j >= 0; j--) {
				if ( i == array[j][6]) {
					array[i][13] = array[i][13] + array[j][13];
					array[i][14] = array[i][14] + array[j][14];
					k++;
				} else if (k == 0) {
					if (array[i][5] != 0) {
						array[i][13] = array[i][9] * 0;
						array[i][14] = array[i][10] * 0;
					}else {
						array[i][13] = roundPlus(getWp(array[i][9], array[i][4]), 4);
						array[i][14] = roundPlus(getWq(array[i][13], 0.75), 4);
					}
				}
			}
		}	
	}

	function calcActivePower (array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][5] == 0) {
				var Snom = findValue(transformData, array[i][4], 1);
				array[i].push(roundPlus(Snom * cosfi * k_z, 5));	
			}else {
				array[i].push(0);	
			}
		}
	}

	function calcReactivePower (array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][5] == 0 ) {
				var Snom = findValue(transformData, array[i][4], 1);
				array[i].push(roundPlus(Snom * sinfi * k_z, 5));
			}else {
				array[i].push(0);	
			}
		}
	}

	function activeLost (array) {
		for (var i = 0; i < array.length; i++) {
			var Lost = roundPlus(( Math.pow(array[i][9], 2) + Math.pow(array[i][10], 2) ) / 
				Math.pow(Unom, 2) * getResistance(array[i][2], array[i][5], array[i][4]), 5 );
			if (array[i][5] != 0) {
				Lost = roundPlus(Lost / 1000, 4);
			}
			array[i].push(Lost);
			console.log('resistance' + getResistance(array[i][2], array[i][5], array[i][4]));
			console.log(Lost);
		}
	}

	function reActiveLost (array) {
		for (var i = 0; i < array.length; i++) {
			var Lost = roundPlus(( Math.pow(array[i][9], 2) + Math.pow(array[i][10], 2) ) / 
				Math.pow(Unom, 2) * getReactiveResistance(array[i][3], array[i][5], array[i][4]), 5 );
			if (array[i][5] != 0) {
				Lost = roundPlus(Lost / 1000, 4);
			}
			array[i].push(Lost);
			console.log('resistance' + getResistance(array[i][3], array[i][5], array[i][4]));
			console.log(Lost);
		}
	}

	function lostInCirciut (array) {
		for (var i = 0; i < array.length; i++) {
			var R = getResistance(array[i][2], array[i][5], array[i][4]);
			var Wp = array[i][13];
			var Wq = array[i][14];
			var tgFi = getTangFi(Wq, Wp);
			var Tma = getTma(Wp, array[i][9]);
			var Kzi = getKz(Tma, 8760);
			var Kfi = getKfi(Kzi);
			var dW = roundPlus( (Math.pow(Wp, 2) * (1 + Math.pow(tgFi, 2)) * Kfi * R / (Math.pow(Unom, 2) * 8760) ), 5);
			if (array[i][5] != 0) {
				dW = roundPlus(dW / 1000, 4);
			}
			array[i].push(dW);
		}
	}	

	function transformImagineLost (array) {
		for (var i = 0; i < array.length; i++) {
			var dPxx = findValue(transformData, array[i][4], 5);
			if (array[i][5] == 0){
				array[i].push(dPxx);
			} else {
				array[i].push(0);
			}
		}
	}

	function voltageFloat (array) {
		for (var i = 0; i < array.length; i++) {
			var Un, Uk, dU;
			if (i == 0){
				Un = U;

			}
			for (var j = 0; j < array.length; j++) {
				if (array[i][6] == j) {
					Un = array[j][17];
				} 
			}
			dU = getVoltageLost(array[i]);
			Uk = roundPlus(Un - dU, 4);
			array[i].push(Uk);
		}
	}

	function transformReactiveImagineLost (array) {
		for (var i = 0; i < array.length; i++) {
			var Ixx = findValue(transformData, array[i][4], 6);
			var Snom = findValue(transformData, array[i][4], 1);
			var dQxx;
			dQxx = roundPlus(Ixx * Snom / 100, 4);
			if (array[i][5] == 0){
				array[i].push(dQxx);
			} else {
				array[i].push(0);
			}
		}
	}

	function getVoltageLost (array) {
		var dU,
			P = array[9],
			Q = array[10],
			r = getResistance(array[2], array[5], array[4]),
			x = getReactiveResistance(array[3], array[5], array[4]);
		dU = roundPlus(((P * r) + (Q * x)) / Unom / 1000, 4);
		return dU;	
	}

	function findValue (array, arg, index) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] == arg){
				return array[i][index];
			}
		}
	}

	function getTransformResistance (Power) {
		var Snom = findValue(transformData, Power, 1);
		var dPkz = findValue(transformData, Power, 3);
		var Unom = findValue(transformData, Power, 2);
		var R;
		R = roundPlus(dPkz * Math.pow(Unom, 2) / Math.pow(Snom, 2), 4);
		return R; 
	}

	function fulldWLost (array) {
		var lineLost = 0,
		 	transformerLost = 0,
		  	XXLost = 0;
		var fullLost = 0;
		var Wpgu;
		for (var i = 0; i < inpData.length; i++) {
			if (inpData[i][5] == 0) {
				transformerLost = transformerLost + inpData[i][15];
			}else {
				lineLost = lineLost + inpData[i][15];
			}
		}
		XXLost = roundPlus(dPLost[2] * T, 4);
		fullLost = transformerLost + lineLost + XXLost;
		Wpgu = inpData[0][13] + fullLost;
		array.push(lineLost);
		array.push(transformerLost);
		array.push(XXLost);
		array.push(fullLost);
		array.push(Wpgu);
	}

	function getTransformReactiveResistance (Power) {
		var Snom = findValue(transformData, Power, 1);
		var dUkz = findValue(transformData, Power, 4);
		var Unom = findValue(transformData, Power, 2);
		var X;
		var R = getTransformResistance(Power);
		var Z = roundPlus(dUkz / 100 * Math.pow(Unom, 2) / Snom, 4);
		X = roundPlus(Math.pow(Math.pow(Z, 2) - Math.pow(R, 2), 0.5), 4);
		return X; 
	}

	function getResistance (r , l, Snom) {
		var R;
		if (l !== 0) {
			R = roundPlus(r * l, 4);
		}else{
			R = getTransformResistance(Snom);
		}	 
		return R;	
	}

	function getReactiveResistance (x, l, Snom) {
		var X;
		if (l !== 0) {
			X = roundPlus(x * l, 4);
		}else{
			X = getTransformReactiveResistance(Snom);
		}	 
		return X;	
	}

	function finalLost (array) {
		var d,
			dt,
			dl,
			dlt,
			dxx;
		d = roundPlus(array[3] / array[4] * 100, 4);
		dt = roundPlus(array[1] / array[4] * 100, 4);	
		dl = roundPlus(array[0] / array[4] * 100, 4);
		dlt = roundPlus((array[0] + array[1])/ array[4] * 100, 4);
		dxx = roundPlus(array[2] / array[4] * 100, 4);
		array.push(d);
		array.push(dt);
		array.push(dl);
		array.push(dlt);
		array.push(dxx);
	}

	function getFullLost (array, index, XXindex) {
		var lineLost = 0,
		 	transformerLost = 0,
		  	XXLost = 0;
		var fullLost = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i][5] == 0) {
				transformerLost = transformerLost + array[i][index];
				XXLost = XXLost + array[i][XXindex];
			}else {
				lineLost = lineLost + array[i][index];
			}
		}
		fullLost = transformerLost + lineLost + XXLost;
		if (index == 11) {
			dPLost.push(lineLost);
			dPLost.push(transformerLost);
			dPLost.push(XXLost);
		}else {
			dQLost.push(lineLost);
			dQLost.push(transformerLost);
			dQLost.push(XXLost);	
		}
		return fullLost;
	}

	function getMainLineValue (array, index, type) {
		var mainLineValue;
		var lostindex;
		var XXindex;
		var fullLost;
		if (type == true) {
			lostindex = 11;
			XXindex = 16;
		}
		else {
			lostindex = 12;
			XXindex = 18;
		}
		fullLost = getFullLost(array, lostindex, XXindex);
		mainLineValue = array[0][index] + fullLost;
		if (type == true) {
			dPLost.push(fullLost);
		}else {
			dQLost.push(fullLost);
		}
		return mainLineValue;
	}

	function findTma (Snom) {
		for (var i = 0; i < tableOfTma.length; i++) {
			if ( (Snom >= tableOfTma[i][0]) && (Snom <= tableOfTma[i][1]) ) {
				return tableOfTma[i][2];
			}
		}
	}

	function getWp ( Pj, type) {
		var Snom = findValue(transformData, type, 1);
		var Tma = findTma(Snom);
		var Wp = roundPlus(Pj * Tma, 4);               
		return Wp;
	}

	function getWq ( Wp, tgFi) {
		var Wq = roundPlus(Wp * tgFi, 4);              
		return Wq;
	}

	function getTma ( Wp, P) {
		 var Tma = roundPlus(Wp / P, 4);                
		 return Tma;
	}

	function getTangFi (Wq, Wp) {
		var TangFi = roundPlus(Wq / Wp, 4);              
		return TangFi;
	}

	function getKz (Tma, T) {
		var Kz = roundPlus(Tma / T, 4);                  
		return Kz;
	}

	function getKfi (Kzi) {
		var Kfi = roundPlus(0.16 / Kzi + 0.82, 4);
		return Kfi;
	}


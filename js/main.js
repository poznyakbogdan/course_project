///////////////--inpdData--////////////////////////////////
//0		start 
//1		end
//2		R0
//3		X0
//4		Snom
//5		Dlina
//6		AO
//7		Active power
//8		Reactive power
//9		Float of active Power
//10	Float of reactive Power
//11    Lost active power
//12	Lost reactive power
//--------------------------------------------------------//

///////////////////////--transformData--////////////////////////////////////
//0     name
//1		Snom
//2		Unom
//3		dPkz
//4		dUkz
//-----------------------------------------------------------------------///



// window.onload = function  () {
	// var StartOfLine = [7     ,9 ,5 ,11 ,14 ,1 ,3 ,6 ,2 ,4 ,12,  14, 5, 12 ,5],
	// 	EndOfLine   = [8    ,10, 6, 12, 15, 2, 4, 7, 3, 5, 13,  16, 9, 14,11],
	// 	Snom        = [100, 100, 0, 0, 100, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0],
	var transformData = [["TM-100", 100, 10.5, 1.97, 5.5],
	["TM-630", 630, 10.5, 8.5, 5.5],
	["TM-63", 63, 10.5, 1.28, 4.5]
	];
	var StartOfLine = [1, 2, 3, 2, 4, 5, 4, 6, 7],
		EndOfLine   = [2, 3, 101, 4, 5, 104, 6, 7, 102],
		Snom        = [0, 0, 100, 0, 0, 630, 0, 0, 63],	
		Q           = [0, 0, 200, 0, 0, 200, 0, 0, 200],
		X0          = [0.36, 0.36, 16.06, 0.36, 0.36, 3.36 ,0.36, 0.36, 70.27],
		R0          = [0.79, 0.79, 7.82, 0.79, 0.79, 0.85 ,0.79, 0.79, 35.56], 
		Dlina       = [1, 2, 0, 3, 4, 0, 5, 6, 0]
	var AS_35_R0    = 0.79,
		AS_35_X0    = 0.36,
		cosfi       = 0.8,
		sinfi       = 0.6,
		k_z         = 0.8,
		Unom        = 10.5,
		U           = roundPlus(Unom * 1.13, 4); 
	var inpData = [];
	var outString = "";	
	var parentElem = document.getElementById("outputtext");
	
	for (var i = 0; i < StartOfLine.length; i++) {                     					 
	 	inpData.push([]);                 	    //-  add the row to array                         			
 		inpData[i].push(StartOfLine[i]);    	  //0  line begine number                    
		inpData[i].push(EndOfLine[i]);        	//1  line end number                       
		inpData[i].push(R0[i]);               	//2  resistanse of line                    
		inpData[i].push(X0[i]);              	 //3  reactive resistance of line           
		inpData[i].push(Snom[i]);	 	     	//4  power of transformer    //костыль              
		inpData[i].push(Dlina[i]);	          	//5  length of line 
		//inpData[i].push(Q[i]);                //6  reactive power                       
	}

	
	function roundPlus(x, n) { //x - число, n - количество знаков
		if(isNaN(x) || isNaN(n)) return false;
		var m = Math.pow(10,n);
		return Math.round(x*m)/m;
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
					//console.log("numb " + i + " , ao " + array[j][6] + " power = " + array[j][7] + " finishpower =" + array[i][7]);
				} else if (k == 0) {
					array[i][9] = array[i][7];
					array[i][10] = array[i][8];
				}
			}
			//console.log(array[i][7]);
			//console.log(array[i][4]);
		}
	}

	function calcActivePower (array) {
		for (var i = 0; i < array.length; i++) {
			array[i].push(roundPlus(array[i][4] * cosfi * k_z, 5));
		}
	}

	function calcReactivePower (array) {
		for (var i = 0; i < array.length; i++) {
			array[i].push(roundPlus(array[i][4] * sinfi * k_z, 5));
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
			var Wp = getWp(array[i][9], 2800);
			var Wq = getWq(Wp, 0.75);
			var tgFi = getTangFi(Wq, Wp);
			var Tma = getTma(Wp, array[i][9]);
			var Kzi = getKz(Tma, 8760);
			var Kfi = getKfi(Kzi);
			var dW = roundPlus( (Math.pow(Wp, 2) * (1 + Math.pow(tgFi, 2)) * Kfi * R / (Math.pow(Unom, 2) * 8760) ), 5);
			if (array[i][5] != 0) {
				dW = roundPlus(dW / 1000, 4);
			}

			console.log("Wp = " + Wp);
			console.log("Wq = " + Wq);
			console.log("tgFi = " + tgFi);
			console.log("Tma = " + Tma);
			console.log("Kz = " + Kzi);
			console.log("Kfi = " + Kfi);
			console.log("dW = " + dW);
			console.log('r = ' + R);
			console.log('---------------------------------------')
			array[i].push(dW);
		}
	}	

	function findValue (array, arg, index) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][1] == arg){
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

	function getWp ( Pj, Tma) {
		var Wp = roundPlus(Pj * Tma, 4);               // 1
		return Wp;
	}

	function getWq ( Wp, tgFi) {
		var Wq = roundPlus(Wp * tgFi, 4);              //1.2
		return Wq;
	}

	function getTma ( Wp, P) {
		 var Tma = roundPlus(Wp / P, 4);                //2
		 return Tma;
	}

	function getTangFi (Wq, Wp) {
		var TangFi = roundPlus(Wq / Wp, 4);              //1.3
		return TangFi;
	}

	function getKz (Tma, T) {
		var Kz = roundPlus(Tma / T, 4);                  //3
		return Kz;
	}

	function getKfi (Kzi) {
		var Kfi = roundPlus(0.16 / Kzi + 0.82, 4);
		return Kfi;
	}

	// var Wp = getWp(635, 2800);
	// var Wq = getWq(Wp, 1.4);
	// var tgFi = getTangFi(Wp, Wq);
	// var Tma = getTma(Wp, 100);
	// var Kzi = getKz(Tma, 8760);
	// var Kfi = getKfi(Kzi);
	// var dW = roundPlus( (Math.pow(Wp, 2) * (1 + Math.pow(tgFi, 2)) * Kfi * 0.79 / (Math.pow(10500, 2) * 8760) ), 8);

	// console.log("Wp = " + Wp);
	// console.log("Wq = " + Wq);
	// console.log("tgFi = " + tgFi);
	// console.log("Tma = " + Tma);
	// console.log("Kz = " + Kzi);
	// console.log("Kfi = " + Kfi);
	// console.log("dW = " + dW);
	

///////////////////-- testing block --////////////////////////////////	
	// var qwe = [9,8,7,6,5,5,5,5,5,4,3,2,1,1023,123,22,3,12,0,-123,22]
	// sortingArrayByIncrease(inpData);

	// for (var i = 0; i < qwe.length; i++) {
	// 	console.log(qwe[i])
	// }
////////////////////////-- end testing --/////////////////////////////////////////
	
	sortingArrayByIncrease(inpData);                  //sort array by number of line begining
	inpData[0].push("start");                         //the start line in circiut
	arrayOfAO(inpData);                               //AO
	calcActivePower(inpData);
	calcReactivePower(inpData);
	floatOfCirciut(inpData);						 
	activeLost (inpData);
	reActiveLost(inpData);
	lostInCirciut(inpData);

	for (var i = 0; i < inpData.length ; i++) {
		var a = ""; 
		//a = i + " , "
		for (var j = 0; j < inpData[1].length; j++) {
			a = a  + inpData[i][j] + " , ";
		}
		console.log(a);
	}

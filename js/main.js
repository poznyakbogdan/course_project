// window.onload = function  () {
	var StartOfLine = [1, 2, 3, 2, 4, 5, 4, 6, 7],
		EndOfLine = [2, 3, 101, 4, 5, 104, 6, 7, 102],
		Snom = [0, 0, 100, 0, 0, 630, 0, 0, 63],
		X0 = [0.36, 0.36, 0, 0.36, 0.36, 0 ,0.36, 0.36, 0],
		R0 = [0.79, 0.79, 0, 0.79, 0.79, 0 ,0.79, 0.79, 0], 
		Dlina = [.1, .2, 0, .3, .4, 0, .5, .6, 0]
	var AS_35_R0 = 0.79,
		AS_35_X0 = 0.36,
		cosfi = 0.8,
		sinfi = 0.6,
		k_z = 0.8;
	var inpData = [];
	var outString = "";	
	var parentElem = document.getElementById("outputtext");
	
	for (var i = 0; i < StartOfLine.length; i++) {                     					 
	 	inpData.push([]);                     //-  add the row to array                         			
 		inpData[i].push(StartOfLine[i]);      //0  line begine number                    
		inpData[i].push(EndOfLine[i]);        //1  line end number                       
		inpData[i].push(R0[i]);               //2  resistanse of line                    
		inpData[i].push(X0[i]);               //3  reactive resistance of line           
		inpData[i].push(Snom[i]);	          //4  power of transformer                  
		inpData[i].push(Dlina[i]);	          //5  length of line                        
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
			for (var j = array.length - 1; j >= 0; j--) {
				if ( i == array[j][6]) {
					array[i][4] = array[i][4] + array[j][4];
					//console.log("numb " + i + " , ao " + array[j][6] + " power = " + array[j][7] + " finishpower =" + array[i][7]);
				} else{
					array[i][7] = array[i][4];
				}
			}
			//console.log(array[i][7]);
			//console.log(array[i][4]);
		}
	}

///////////////////-- testing block --////////////////////////////////	
	// var qwe = [9,8,7,6,5,5,5,5,5,4,3,2,1,1023,123,22,3,12,0,-123,22]
	// sortingArrayByIncrease(inpData);

	// for (var i = 0; i < qwe.length; i++) {
	// 	console.log(qwe[i])
	// }
////////////////////////-- end testing --/////////////////////////////////////////
	
	sortingArrayByIncrease(inpData);                  //sort array by number of line begining
	inpData[0].push("start");
	arrayOfAO(inpData);
	floatOfCirciut(inpData);

	for (var i = 0; i < inpData.length ; i++) {
		var a = ""; 
		//a = i + " , "
		for (var j = 0; j < inpData[1].length; j++) {
			a = a  + inpData[i][j] + " , ";
		}
		console.log(a);
	}


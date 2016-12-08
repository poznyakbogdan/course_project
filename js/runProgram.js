$("#userBeginData").click(function () {
	var user_test_LineBegin = $("input[name='lineBegining']");
	var user_test_LineEnd = $("input[name='lineEnding']");
	var user_test_LineLength = $("input[name='lineLength']");
	var user_test_LineType = $("input[name='wireType']");
	var user_test_Snom = $("input[name='transformType']");

	StartOfLine.splice(0, StartOfLine.length);
	EndOfLine.splice(0, EndOfLine.length);
	Dlina.splice(0, Dlina.length);
	lineType.splice(0, lineType.length);
	Snom.splice(0, Snom.length);
	
	for (var i = 0; i < user_test_LineBegin.length; i++) {
		StartOfLine.push(+user_test_LineBegin[i].value);
		EndOfLine.push(+user_test_LineEnd[i].value);

		if (user_test_LineLength[i].value == "") {
			Dlina.push(0);
		}else {
			Dlina.push(+user_test_LineLength[i].value);	
		}
		
		if (user_test_LineType[i].value == "") {
			lineType.push(0);
		}else {
			lineType.push(user_test_LineType[i].value);	
		}
		
		if (user_test_Snom[i].value == "") {
			Snom.push(0);
		}else {
			Snom.push(user_test_Snom[i].value);	
		}
	}	
});


$('#startProgram').click( function () {
		inpData.splice(0, inpData.length);
	
		convertingResistance (lineType, 1, true);
		convertingResistance (lineType, 2, false);
		
		for (var i = 0; i < StartOfLine.length; i++) {                     					 
		 	inpData.push([]);                 	                            			
	 		inpData[i].push(StartOfLine[i]);    	                  
			inpData[i].push(EndOfLine[i]);        	                      
			inpData[i].push(R0[i]);               	              
			inpData[i].push(X0[i]);              	         
			inpData[i].push(Snom[i]);	 	     	                 
			inpData[i].push(Dlina[i]);	     
		                                 
		}
		
		sortingArrayByIncrease(inpData);                  
		inpData[0].push("#");                         
		arrayOfAO(inpData);                              
		calcActivePower(inpData);
		calcReactivePower(inpData);
		floatOfCirciut(inpData);						 
		activeLost (inpData);
		reActiveLost(inpData);
		energyFloat (inpData);
		lostInCirciut(inpData);
		transformImagineLost(inpData);
		voltageFloat(inpData);
		transformReactiveImagineLost(inpData);
		dPLost.push(getMainLineValue (inpData, 9, true));
		dQLost.push(getMainLineValue (inpData, 10, false));
		finalLost (dPLost);
		finalLost (dQLost);
		fulldWLost(dWLost);
		finalLost (dWLost);

		console.table(inpData);



//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////--** output **--///////////////////////////////////////////


		function createTd (val) {
			var text = document.createTextNode(val);
			var td_elem = document.createElement('td');
			td_elem.appendChild(text);
			return td_elem;
		}

		function createTr (){
			var tr_elem = document.createElement('tr');
			return tr_elem;
		}
		
		for (var i = 0; i < inpData.length; i++) {
			var tr = createTr ();
			for (var j = 0; j < inpData[i].length; j++) {
				tr.appendChild(createTd(inpData[i][j]));
			}
			$(tr).appendTo('.result_table');
		}


		lost_table_create(dQLost, "dQ_result_output");
		lost_table_create(dPLost, "dP_result_output");
		lost_table_create(dWLost, "dW_result_output");


		function lost_table_create (data, classname) {
			tr = createTr();
			for (var i = 5; i < data.length; i++) {
			$(createTd(data[i])).appendTo(tr);
			}
			$(tr).appendTo('.' + classname + "");			
		}

		draw_circuit(10);
		$('.draw_chart').click();
		scrollToInfo();
});

function scrollToInfo () {
	$('html, body').animate({scrollTop: $('#out_info').offset().top}, 800);
	return false;	
}

$(".run_width_my_option").click(function () {
	doWithDataOf25Option();
	$('#startProgram').click();		
});

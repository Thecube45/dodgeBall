
//gestione dell'evento onkeydown:
function checkKeyDown(e) {
    e = e || window.event;
    switch(e.keyCode){
	case 39: destra(); break;
	
	case 37: sinistra();   break;
	
    }    
}   

// gestione dell'evento onkey press:
function checkKeyPress (event){
    var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
    
	switch(chCode){
    	case 100: destra();   break;
    	
    	case 97:  sinistra(); break;
    	
    }
     
}


function controllaCella(x,y){
	switch (piano[x][y]){

		default: 
	      return true; 
	}

	return true; 
}

function sposta (daX,daY, aX,aY){
	if (controllaCella(aX, aY)){
	    
		var daSrc = "c" +daX+"_"+daY; 
	    var aSrc  = "c" + aX+"_"+ aY;
		console.log(daSrc + " " +aSrc);
        document.getElementById(daSrc).src = pathImg +  piano[daX][daY] + ".jpg";
		ominoX= aX;
		ominoY= aY;
		disegnaOmino();
	}
}



function sinistra(){
	if(ominoY>0){
	var newY = (ominoY-1); 
	sposta (ominoX,ominoY, ominoX,newY);
}
	
}



function destra(){
	if(ominoY<6){
	var newY = (ominoY + 1); 
	sposta (ominoX,ominoY, ominoX,newY);
	}
}
// blocco movimento/animazione dell'omino
var ominoMoving = false;
// ridotto da 150 a 40 ms per movimenti più reattivi
var moveDelayMs = 40; // durata animazione (ms)

//gestione dell'evento onkeydown:
function checkKeyDown(e) {
    e = e || window.event;
    switch(e.keyCode){
        case 39: destra(); break;
        case 37: sinistra(); break;
    }
}

// gestione dell'evento onkey press:
function checkKeyPress (event){
    var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
    switch(chCode){
        case 100: destra(); break;
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
        // pulisco la cella di partenza (sfondo)
        var elDa = document.getElementById(daSrc);
        if (elDa) elDa.src = pathImg +  piano[daX][daY] + ".jpg";
        // aggiorno le coordinate interne
        ominoX = aX;
        ominoY = aY;
        // non disegno subito l'omino "idle": disegnaPiano/aggiorna gestiranno lo stato corrente
        disegnaPiano();
    }
}

// funzione helper che esegue lo spostamento con animazione:
// dir = "left" | "right"
function iniziomove(newY, dir) {
    if (ominoMoving) return; // evita movimenti ripetuti
    ominoMoving = true;
    // setta lo stato sprite per il disegno (mappa.js leggerà ominoState)
    ominoState = (dir === "left") ? "omino_run_left" : "omino_run_right";
    // esegue lo spostamento logico (riga invariata)
    sposta(ominoX, ominoY, ominoX, newY);

    // mantiene l'animazione per moveDelayMs, poi torna allo sprite base
    setTimeout(function(){
        ominoState = "omino";
        ominoMoving = false;
        disegnaPiano();
        disegnaOmino();
    }, moveDelayMs);
}

function sinistra(){
    if (ominoMoving) return;
    if (ominoY>1){
        var newY = (ominoY-1);
        iniziomove(newY, "left");
    }
}

function destra(){
    if (ominoMoving) return;
    if (ominoY<7){
        var newY = (ominoY + 1);
        iniziomove(newY, "right");
    }
}
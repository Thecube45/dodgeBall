// blocco movimento/animazione dell'omino
var ominoMoving = false;
// cooldown e durata animazione (più reattivo, ma con animazione visibile)
var moveDelayMs = 120;       // durata animazione (ms)
var minMoveIntervalMs = 30;  // cooldown minimo tra due spostamenti
var lastMoveTime = 0;       

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
    var now = Date.now();
    if (now - lastMoveTime < minMoveIntervalMs) return;
    lastMoveTime = now;

    // mostra frame di corsa
    ominoState = (dir === "left") ? "omino_run_left" : "omino_run_right";

    // esegui lo spostamento subito
    sposta(ominoX, ominoY, ominoX, newY);

    // torna a idle dopo breve tempo
    setTimeout(function(){
        ominoState = "omino";
        disegnaPiano();
        disegnaOmino();
    }, moveDelayMs);
}

function sinistra(){
    // riga invariata, colonna minima = 0
    if (ominoY > 0) {
        iniziomove(ominoY - 1, "left");
    }
}

function destra(){
    var maxCol = (typeof C === "number") ? C - 1 : 8;
    if (ominoY < maxCol) {
        iniziomove(ominoY + 1, "right");
    }
}
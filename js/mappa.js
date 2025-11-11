// posizione iniziale dell'omino
var ominoX = 9; 
var ominoY = 3;




// costanti e parametri per la configurazioen del gioco



var SFONDO = 0;
/*
// Creazione dell'istanza del nemico
var cacciatore = new Nemico(5, 5, "cacciatore"); // x, y, nome immagine

// Muove il nemico ogni 500 ms (1/2 secondo)
const intervalloMovimento = setInterval("cacciatore.muovi()" , 500);
*/
var omino = "omino";

var pathImg = "img1/";

// nuovo oggetto omino (usato dai cacciatori per inseguire)
var ominoObj = { x: ominoX, y: ominoY };

// array di cacciatori
var cacciatori = [];

// stato del gioco / intervalli
var gameStarted = false;
var _updateIntervalMs = 100;
var updateIntervalId = null;
var spawnIntervalId = null;

// aggiunto punteggio globale
var score = 0;

// genera e aggiunge un cacciatore (richiede che js/cacciatore.js sia caricato)
function spawnCacciatore(x, y, opts) {
    if (typeof Cacciatore === "undefined") {
        console.warn("Cacciatore non definito: carica js/cacciatore.js prima di mappa.js");
        return;
    }
    var c = new Cacciatore(x, y, ominoObj, opts);
    cacciatori.push(c);
    return c;
}

function spawnCacciatoreRandom() {
    // protezione: se C non inizializzato ancora, usa 9 come default
    var cols = (typeof C === "number") ? C : 9;
    var col = Math.floor(Math.random() * cols);
    var row = 0; // spawn in cima
    // passiamo (riga, colonna)
    spawnCacciatore(row, col, { chaseInterval: 400, maxMisses: 50 });
}

// aggiorna tutti i cacciatori (dt in ms)
function aggiornaCacciatori(dt) {
    // aggiorna l'oggetto omino con le coordinate correnti
    ominoObj.x = ominoX;
    ominoObj.y = ominoY;

    for (var k = cacciatori.length - 1; k >= 0; k--) {
        var c = cacciatori[k];
        c.update(dt);

        // se il cacciatore è "dead" valutiamo la reason prima di rimuoverlo
        if (c.dead) {
            // se è scomparso per "miss" aggiungiamo 100 punti
            if (c.reason === 'miss') {
                score += 100;
            }
            // rimuoviamo l'elemento dall'array
            cacciatori.splice(k, 1);
        }
    }
}

// disegna i cacciatori (prima dell'omino così l'omino resta visibile sopra)
function disegnaCacciatori() {
    for (var k = 0; k < cacciatori.length; k++) {
        var c = cacciatori[k];
        if (c.dead) continue;
        var sprite = c.caught ? "cacciatore_cattura" : "cacciatore";
        disegnaCellaSpeciale(c.x, c.y, sprite);
    }
}

// mostra i contatori in pagina (se gli elementi esistono)
function aggiornaContatoriNellaPagina() {
    if (typeof getCacciati === "function") {
        var el = document.getElementById("cacciatiCounter");
        if (el) el.innerText = "Cacciati: " + getCacciati();
    }
    if (typeof getCacciatoriScomparsi === "function") {
        var el2 = document.getElementById("cacciatoriScomparsiCounter");
        if (el2) el2.innerText = "Cacciatori scomparsi: " + getCacciatoriScomparsi();
    }
    // aggiorniamo il punteggio nella pagina
    var scoreEl = document.getElementById("scoreCounter");
    if (scoreEl) scoreEl.innerText = "Punti: " + score;
}

// dichiarazione variabili di lavoro
var i=0;
var j=0;


// numero di righe e numero di colonne
var R = 10; 
var C = 9; 

// definizione id matrice, come array di array
var piano = new Array();

for (var i=0; i<R; i++) {
    piano[i]=new Array(); // ogni riga contiene un array
    for (var j=0; j<C;j++){
        piano[i][j]=SFONDO;
    }
}

function disegnaPiano(){
    // al primo disegno avvia il gioco (startGame) una sola volta
    if (!gameStarted) startGame();

    for (var i=0; i<R; i++){
        for (var j=0; j<C;j++){
            disegnaCella(i,j);
        }
    }
    // disegna i cacciatori PRIMA dell'omino (così l'omino resta visibile sopra)
    disegnaCacciatori();
    // disegna l'omino in una data posizione
    disegnaCellaSpeciale(ominoX,ominoY,omino); 
}

// funzione che avvia gli intervalli di update/spawn (evita avvii multipli)
function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    // loop di aggiornamento per i cacciatori e ridisegno
    updateIntervalId = setInterval(function(){
        aggiornaCacciatori(_updateIntervalMs);
        disegnaPiano();
    }, _updateIntervalMs);

    // spawn periodico di cacciatori (uno ogni 3 secondi)
    spawnIntervalId = setInterval(function(){
        spawnCacciatoreRandom();
    }, 3000);
}

// se vuoi fermare il gioco in futuro
function stopGame() {
    if (!gameStarted) return;
    gameStarted = false;
    if (updateIntervalId) { clearInterval(updateIntervalId); updateIntervalId = null; }
    if (spawnIntervalId)  { clearInterval(spawnIntervalId);  spawnIntervalId  = null; }
}

function mostraMatriceHTML(){
	var s = "";

	for (var i=0; i<R; i++) {
		for (var j=0; j<C;j++){
			s = s + piano[i][j] + " " ;
		}
		s = s + "<br>";
	}
	document.getElementById("messaggioDebug").innerHTML=s; 
}

function disegnaCella(i,j){
	var id = "c"+i+"_"+j;
	var src = pathImg + piano[i][j] + ".jpg";
	document.getElementById(id).src= src;
} 

function disegnaCellaSpeciale(i,j,valore) {
    var id = "c"+i+"_"+j;
    var ext = (valore === "cacciatore" || valore === "cacciatore_cattura") ? ".png" : ".jpg";
    var src = pathImg + valore + ext;
    console.log(id + " " + src);
    var el = document.getElementById(id);
    if (el) el.src = src;
} 

function disegnaOmino() {
    disegnaCellaSpeciale(ominoX,ominoY,omino);
    document.getElementById("posizioneOmino").innerHTML=" coordinate omino: Omino(" + ominoX + "," + ominoY + ")"; 
    aggiornaContatoriNellaPagina();
}



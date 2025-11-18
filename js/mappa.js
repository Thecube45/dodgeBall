// posizione iniziale dell'omino
var ominoX = 9; 
var ominoY = 3;




// costanti e parametri per la configurazioen del gioco



var SFONDO = 0;

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

// stato sprite dell'omino (valori: "omino", "omino_run_left", "omino_run_right")
var ominoState = "omino";

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

        // se il cacciatore è morto valutiamo il motivo
        if (c.dead) {
            // se l'ha mancato aggiungiamo 100 punti
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
        // usa il metodo draw del cacciatore (aggiorna l'img corrispondente)
        if (typeof c.draw === "function") c.draw();
        else {
            var sprite = c.caught ? "cacciatore_cattura" : "cacciatore";
            disegnaCellaSpeciale(c.x, c.y, sprite);
        }
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

    disegnaCacciatori();

    // usa lo stato corrente per scegliere quale sprite dell'omino mostrare
    disegnaCellaSpeciale(ominoX, ominoY, ominoState);
}

//  avvia gli intervalli di update/spawn 
function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    // aggiorna i cacciatori nel piano
    updateIntervalId = setInterval(function(){
        aggiornaCacciatori(_updateIntervalMs);
        disegnaPiano();
    }, _updateIntervalMs);

    // spawn periodico di cacciatori (uno ogni 3 secondi)
    spawnIntervalId = setInterval(function(){
        spawnCacciatoreRandom();
    }, 3000);
}

// x fermare il gioco 
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
    // elenco sprite che usano .png (trasparenza)
    var pngNames = {
        "cacciatore": true,
        "cacciatore_cattura": true,
        "poliziotto": true,
        "poliziotto_cattura": true,
        "omino": true,
        "omino_run_left": true,
        "omino_run_right": true
    };
    var ext = pngNames[valore] ? ".png" : ".jpg";
    var src = pathImg + valore + ext;
    // console.log(id + " " + src);
    var el = document.getElementById(id);
    if (el) el.src = src;
} 

function disegnaOmino() {
    // disegna secondo lo stato corrente
    disegnaCellaSpeciale(ominoX,ominoY,ominoState);
    var posEl = document.getElementById("posizioneOmino");
    if (posEl) posEl.innerHTML = " coordinate omino: Omino(" + ominoX + "," + ominoY + ")";
    aggiornaContatoriNellaPagina();
}



// Classe Cacciatore: avanza di 1 in avanti più velocemente,
// mentre il movimento orizzontale è ritardato rispetto all'avanzamento.

let cacciatoriScomparsi = 0;
let cacciati = 0; // contatore per quante volte un cacciatore prende l'omino

class Cacciatore {
    constructor(x, y, omino, opts = {}) {
        this.x = x; this.y = y; this.omino = omino;
        // verticale più veloce (ma non troppo piccolo)
        this.chaseInterval = opts.chaseInterval ?? 50; // ms
        // orizzontale più lento (ritardato)
        this.horizInterval = opts.horizInterval ?? 50; // ms
        this.maxMisses = opts.maxMisses ?? 60;
        this.stepTimer = 0;
        this.horizTimer = 0;
        this.misses = 0;
        this.dead = false;
        this.caught = false;
        this.reason = null;
    }

    // dt in ms
    update(dt) {
        if (this.dead) return;

        this.stepTimer += dt;
        // processiamo TUTTI i passi verticali che sono stati accumulati (se dt >> chaseInterval)
        while (this.stepTimer >= this.chaseInterval) {
            this.stepTimer -= this.chaseInterval;
            this.x += 1;

            // fuori mappa => miss
            if (typeof R === "number" && this.x >= R) { this.remove('miss'); return; }

            // controllo presa
            if (this.x === this.omino.x && this.y === this.omino.y) {
                this.caught = true; cacciati += 1; this.remove('caught'); return;
            }

            if (++this.misses >= this.maxMisses) { this.remove('miss'); return; }
        }

        // movimento orizzontale (più lento): processa passo singolo per ogni horizInterval accumulato
        this.horizTimer += dt;
        while (this.horizTimer >= this.horizInterval) {
            this.horizTimer -= this.horizInterval;
            if (this.omino.y > this.y) this.y += 1;
            else if (this.omino.y < this.y) this.y -= 1;

            if (this.x === this.omino.x && this.y === this.omino.y) {
                this.caught = true; cacciati += 1; this.remove('caught'); return;
            }
        }
    }

    remove(reason) {
        if (!this.dead) {
            this.dead = true;
            this.reason = reason || 'miss';
            cacciatoriScomparsi += 1;
        }
    }

    draw() {
        if (this.dead) return;
        var id = "c" + this.x + "_" + this.y;
        var el = document.getElementById(id);
        if (!el) return;
        var imgFolder = (typeof pathImg !== "undefined") ? pathImg : "img1/";
        var imgName = this.caught ? "poliziotto" : "poliziotto";
        // usa .png per i cacciatori
        el.src = imgFolder + imgName + ".png";
    }
}

window.Cacciatore = Cacciatore;
window.getCacciatoriScomparsi = function(){ return cacciatoriScomparsi; };
window.getCacciati = function(){ return cacciati; };





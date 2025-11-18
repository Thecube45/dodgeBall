// Classe Cacciatore: avanza di 1 in avanti più velocemente,
// mentre il movimento orizzontale è ritardato rispetto all'avanzamento.

let cacciatoriScomparsi = 0;
let cacciati = 0; // contatore per quante volte un cacciatore prende l'omino

class Cacciatore {
    constructor(x, y, omino, opts = {}) {
        this.x = x; // riga
        this.y = y; // colonna
        this.omino = omino; // oggetto con .x (riga) e .y (colonna)

        // intervallo verticale (avanzamento) — più basso = va più veloce in avanti
        this.chaseInterval = opts.chaseInterval ?? 50; // ms (default più rapido)

        // intervallo orizzontale — muove lateralmente solo ogni horizInterval
        this.horizInterval = opts.horizInterval ?? (this.chaseInterval * 2); // ms

        this.maxMisses = opts.maxMisses ?? 60; // passi prima di scomparire
        this.stepTimer = 0;
        this.horizTimer = 0;
        this.misses = 0;
        this.dead = false;
        this.caught = false;
        this.reason = null; // 'caught' or 'miss'
    }

    // dt in millisecondi
    update(dt) {
        if (this.dead) return;

        this.stepTimer += dt;
        this.horizTimer += dt;

        // Avanza in verticale ogni chaseInterval
        if (this.stepTimer >= this.chaseInterval) {
            this.stepTimer -= this.chaseInterval;

            // Avanza sempre di uno in verticale (riga)
            this.x += 1;

            // se ha oltrepassato il fondo della mappa, scompare (è un "miss")
            if (typeof R === "number" && this.x >= R) {
                this.remove('miss');
                return;
            }

            // ogni volta che avanza controlliamo se ha raggiunto l'omino
            if (this.x === this.omino.x && this.y === this.omino.y) {
                this.caught = true;
                cacciati += 1;
                this.remove('caught');
                return;
            }

            // conta un passo "miss" se non ha preso l'omino
            this.misses += 1;
            if (this.misses >= this.maxMisses) {
                this.remove('miss');
                return;
            }
        }

        // Muove orizzontalmente solo quando horizTimer supera horizInterval
        if (this.horizTimer >= this.horizInterval) {
            this.horizTimer -= this.horizInterval;

            if (this.omino.y > this.y) this.y += 1;
            else if (this.omino.y < this.y) this.y -= 1;

            // controllo presa dopo la mossa orizzontale
            if (this.x === this.omino.x && this.y === this.omino.y) {
                this.caught = true;
                cacciati += 1;
                this.remove('caught');
                return;
            }
        }
    }

    // reason: 'caught' | 'miss'
    remove(reason) {
        if (!this.dead) {
            this.dead = true;
            this.reason = reason || 'miss';
            cacciatoriScomparsi += 1;
        }
    }

    draw() {
        if (this.dead) return;
        var id = "c" + this.x + "_" + this.y; // formato c<riga>_<colonna>
        var el = document.getElementById(id);
        if (!el) return;
        var imgFolder = (typeof pathImg !== "undefined") ? pathImg : "img1/";
        var imgName = this.caught ? "cacciatore_cattura.jpg" : "poliziotto.png";
        el.src = imgFolder + imgName;
    }
}

window.Cacciatore = Cacciatore;
window.getCacciatoriScomparsi = function(){ return cacciatoriScomparsi; };
window.getCacciati = function(){ return cacciati; };





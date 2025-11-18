// Classe Cacciatore: avanza di 1 in y ogni intervallo,
// poi cerca di inseguire l'omino muovendosi di 1 a destra o sinistra.
// per il prof:ctx sta per il contesto di disegno (canvas 2D)


let cacciatoriScomparsi = 0;
let cacciati = 0; // contatore per quante volte un cacciatore prende l'omino

class Cacciatore {
    constructor(x, y, omino, opts = {}) {
        this.x = x; // riga
        this.y = y; // colonna
        this.omino = omino; // oggetto con .x (riga) e .y (colonna)
        this.chaseInterval = opts.chaseInterval ?? 500; // ms
        this.maxMisses = opts.maxMisses ?? 60; // passi prima di scomparire
        this.stepTimer = 0;
        this.misses = 0;
        this.dead = false;
        this.caught = false;
        this.reason = null; // 'caught' or 'miss'
    }

    // dt in millisecondi
    update(dt) {
        if (this.dead) return;

        this.stepTimer += dt;
        if (this.stepTimer >= this.chaseInterval) {
            this.stepTimer -= this.chaseInterval;

            // Avanza sempre di uno in verticale (riga)
            this.x += 1;

            // se ha oltrepassato il fondo della mappa, scompare (è un "miss")
            if (typeof R === "number" && this.x >= R) {
                this.remove('miss');
                return;
            }

            // Poi insegue orizzontalmente di 1 verso l'omino (colonna)
            if (this.omino.y > this.y) this.y += 1;
            else if (this.omino.y < this.y) this.y -= 1;

            // Controllo presa (l'omino non viene rimosso)
            if (this.x === this.omino.x && this.y === this.omino.y) {
                this.caught = true;
                cacciati += 1; // incrementa il contatore quando prende l'omino
                // il cacciatore scompare quando prende l'omino
                this.remove('caught');
                return;
            }

            // Se non ha preso l'omino aumenta i "misses"
            this.misses += 1;
            if (this.misses >= this.maxMisses) {
                this.remove('miss');
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
        var imgName = this.caught ? "cacciatore_cattura.jpg" : "cacciatore.jpg";
        el.src = imgFolder + imgName;
    }
}
window.Cacciatore = Cacciatore;
window.getCacciatoriScomparsi = function(){ return cacciatoriScomparsi; };
window.getCacciati = function(){ return cacciati; };





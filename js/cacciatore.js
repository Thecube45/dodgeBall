// Classe Cacciatore: avanza di 1 in avanti più velocemente,
// mentre il movimento orizzontale è ritardato rispetto all'avanzamento.

let cacciatoriScomparsi = 0;
let cacciati = 0; // contatore per quante volte un cacciatore prende l'omino

class Cacciatore {
    constructor(x, y, omino, opts = {}) {
        this.x = x; this.y = y; this.omino = omino;

        // vertical speed: più veloce (intervallo più piccolo)
        this.chaseInterval = opts.chaseInterval ?? 120; // ms (faster forward)

        // horizontal chase: meno aggressivo (intervallo più grande -> meno side steps)
        this.horizInterval = opts.horizInterval ?? 300; // ms (slower lateral)

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

        // vertical movement: at most one vertical step per update (predictable)
        this.stepTimer += dt;
        if (this.stepTimer >= this.chaseInterval) {
            this.stepTimer -= this.chaseInterval;
            this.x += 1;
            if (typeof R === "number" && this.x >= R) { this.remove('miss'); return; }
            if (this.x === this.omino.x && this.y === this.omino.y) { this.caught = true; cacciati += 1; this.remove('caught'); return; }
            if (++this.misses >= this.maxMisses) { this.remove('miss'); return; }
        }

        // horizontal movement: allow a step whenever horizInterval passes (more responsive now)
        this.horizTimer += dt;
        if (this.horizTimer >= this.horizInterval) {
            this.horizTimer -= this.horizInterval;
            if (this.omino.y > this.y) this.y += 1;
            else if (this.omino.y < this.y) this.y -= 1;
if (this.x === this.omino.x && this.y === this.omino.y) {
    this.caught = true;
    cacciati += 1;

    if (typeof subisciColpo === "function") {
        subisciColpo();
    }

    this.remove('caught');
    return;
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
        var imgName = this.caught ? "cacciatore_cattura" : "poliziotto";
        el.src = imgFolder + imgName + ".png";
    }
}

window.Cacciatore = Cacciatore;
window.getCacciatoriScomparsi = function(){ return cacciatoriScomparsi; };
window.getCacciati = function(){ return cacciati; };





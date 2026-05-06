class Item {
    constructor(x, y, w, h, name, value) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
        this.value = value;
        this.collected = false;
    }

    update() {}

    display() {}
}

class Loot extends Item {
    constructor(x, y, value = 10) {
        super(x, y, 38, 38, "Gem", value);
    }

    collect(player){
        if (!this.collected) {
            player.addMoney(this.value);
            this.collected = true;
        }
    }

    display() {
        if (this.collected) return;

        if (gemImg) {
            image(gemImg, this.x, this.y, this.w, this.h);
        } else {
            fill(255, 215, 0);
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
        }
    }
}

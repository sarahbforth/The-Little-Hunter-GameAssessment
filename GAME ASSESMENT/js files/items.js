/**
 * Base class for collectable items
 * 
 * Stores position / size / name / value / collection state
 */
class Item {
    /**
     * @param {number} x - x position
     * @param {number} y - y position
     * @param {number} w - width
     * @param {number} h - height
     * @param {string} name - name
     * @param {number} value - value
     */
    constructor(x, y, w, h, name, value) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
        this.value = value;
        this.collected = false;
    }

    /**
     * Update frames - empty for override
     */
    update() {}

    /**
     * Display method - empty for override
     */
    display() {}
}

/**
 * Class for collectable gems
 * 
 * Extends Item - adds value to player
 */
class Loot extends Item {
    /**
     * @param {number} x - x position
     * @param {number} y - y position
     * @param {number} value - value
     */
    constructor(x, y, value = 10) {
        super(x, y, 38, 38, "Gem", value);
    }

    /**
     * Collects and adds value to player - can only be collected once
     * @param {Player} player - target
     */
    collect(player){
        if (!this.collected) {
            player.addMoney(this.value);
            this.collected = true;
        }
    }

    /**
     * Display method if not collected 
     */
    display() {
        if (this.collected) return;

        if (gemImg) {
            image(gemImg, this.x, this.y, this.w, this.h);
        } else {
            //default if image missing
            fill(255, 215, 0);
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
        }
    }
}

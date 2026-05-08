class DialogueBox {
    dialogue;
    index;
    outOfLines;
    charIndex;
    speed;

    constructor(dialogue) {
        this.dialogue = dialogue;
        this.index = 0;
        this.outOfLines = false;
        this.charIndex = 0;
        this.speed = 1;
    }

    draw () {
        if(this.outOfLines || this.dialogue.length === 0) return;
        
        let currentLine = this.dialogue[this.index];
        
        if (!sceneManager.isTransitioning && this.charIndex < currentLine.length){
            this.charIndex += this.speed;
        }

        let visibleText = currentLine.substring(0, floor(this.charIndex));

        push()

        fill(0);
        stroke(255);
        rect(0, height- 80, 960, 120);

        fill(255);
        noStroke();
        textSize(30);
        textAlign(LEFT,CENTER);
        textFont(dialogueFont);
        text(visibleText, 80, height - 90, width - 50, 80);

        pop();
    }

    nextLine() {
        this.index++;
        this.charIndex = 0;

        if (this.index >= this.dialogue.length) {
            this.outOfLines = true;
        }
    }

    reset(dialogue) {
        this.dialogue = dialogue;
        this.index = 0;
        this.outOfLines = false;
    }

    finishLine() {
        if (this.outOfLines) return;

        let currentLine = this.dialogue[this.index];
        this.charIndex = currentLine.length;
  }

    isLineFinished() {
        if (this.outOfLines) return true;

        let currentLine = this.dialogue[this.index];
        return this.charIndex >= currentLine.length;
  }
}

class GameUI {
    constructor() {
     this.panelX = 20;
     this.panelY = 20;
     this.panelW = 220;
     this.panelH = 120;
  }

  drawPlayerPanel(player) {
    let x = this.panelX;
    let y = this.panelY;
    let w = this.panelW;
    let h = this.panelH;

    push();

    // panel
    fill(0, 180);
    stroke(255);
    strokeWeight(2);
    rect(x, y, w, h, 12);

    fill(255);
    noStroke();
    textFont(dialogueFont);
    textAlign(LEFT, TOP);

    // title
    textSize(18);
    text("Hunter Status", x + 15, y + 10);

    // health label
    textSize(14);
    text("Health", x + 15, y + 38);

    // health bar background
    fill(60);
    rect(x + 15, y + 58, 140, 16, 4);

    // health bar fill
    let healthPercent = player.health / player.maxHealth;
    fill(200, 40, 40);
    rect(x + 15, y + 58, 140 * healthPercent, 16, 4);

    // health text
    fill(255);
    text(`${player.health} / ${player.maxHealth}`, x + 165, y + 54);

    // gems
    text(`Gems: ${player.money}`, x + 15, y + 82);

    // weapon
    let weaponText = gameManager.hasWeapon ? "Yes" : "No";
    text(`Weapon: ${weaponText}`, x + 15, y + 100);

    pop();
  }

  drawBossPanel(boss) {
    let w = 220;
    let h = 70;
    let x = width - w - 20;
    let y = 20;

    push();

    fill(0, 180);
    stroke(255);
    strokeWeight(2);
    rect(x, y, w, h, 12);

    fill(255);
    noStroke();
    textFont(dialogueFont);
    textAlign(LEFT, TOP);

    textSize(18);
    text("Boss", x + 15, y + 10);

    // boss health bar background
    fill(60);
    rect(x + 15, y + 38, 190, 16, 4);

    // boss health bar fill
    let healthPercent = boss.health / boss.maxHealth;
    fill(180, 0, 180);
    rect(x + 15, y + 38, 190 * healthPercent, 16, 4);

    pop();
  }
}

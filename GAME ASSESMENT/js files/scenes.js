class BaseScene {
  constructor(name) {
    this.name = name;
  }

  enter() {
    console.log(`Entering scene: ${this.name}`);
  }

  update() {}

  display() {}

  exit() {
    console.log(`Exiting scene: ${this.name}`);
  }

  handleKeyPressed(key) {}

  handleMousePressed() {}

  drawSceneLabel(title, subtitle = "") {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text(title, width / 2, height / 2 - 40);

    textSize(18);
    text(subtitle, width / 2, height / 2 + 10);
  }

  drawInstruction(textValue) {
    fill(255,255,0);
    textAlign(CENTER,CENTER);
    textSize(16);
    text(textValue, width/2,height-50);
  }
  }


class TitleScene extends BaseScene {
  constructor() {
    super("title");
  }

  display() {
    background(20, 30, 60);
    this.drawSceneLabel("THE LITTLE HUNTER", "Press ENTER to start");
  }

  handleKeyPressed(key) {
    if (keyCode === ENTER) {
      sceneManager.changeScene("cutscene1");
    }
  }
}

class CutsceneScene extends BaseScene {
  constructor(name, titleText, dialogueLines, nextSceneName, backgroundImage) {
    super(name);
    this.titleText = titleText;
    this.dialogueLines = dialogueLines;
    this.nextSceneName = nextSceneName;
    this.backgroundImage = backgroundImage;
  }

  enter() {
    this.dialogueBox = new DialogueBox(this.dialogueLines);
  }

  display() {
    background(0);
    if (this.backgroundImage) {
      image(this.backgroundImage, 0, 0, width, height);
    }

    if (this.dialogueBox) {
      this.dialogueBox.draw();
    }
  }

  handleKeyPressed(key) {
    if (key === " ") {
      if (!this.dialogueBox.outOfLines) {
        this.dialogueBox.nextLine();
      }

      if (this.dialogueBox.outOfLines) {
        sceneManager.changeScene(this.nextSceneName);
      }
    }
  }
}


class ExploreScene extends BaseScene {
  constructor() {
    super("location1");
    this.lootItems = [];
    this.worldWidth = 1980;
    this.worldHeight = 1080;
    this.obstacles = [];

    this.respawnFadeAlpha = 0;
    this.respawnFading = false;
  }

  enter() {

    player.x = 450;
    player.y = 140;

    this.lootItems = [
      new Loot(100,950,10), new Loot(780,610,15), new Loot(1295,975,20), new Loot(1005,265,25), new Loot(1755,960,30)
    ];

    this.slime = [
      new Enemy(160, 690, "slime1", 10, 5, slimeAnimation1),
      new Enemy(900, 270, "slime1", 10, 5, slimeAnimation1),
      new Enemy(285, 285, "slime2", 10, 10, slimeAnimation2),
      new Enemy(830, 930, "slime2", 10, 10, slimeAnimation2),
      new Enemy(1200, 600, "slime2", 10, 10, slimeAnimation2),
      new Enemy(840, 545, "slime3", 10, 15, slimeAnimation3),
      new Enemy(400, 930, "slime3", 10, 15, slimeAnimation3),
      new Enemy(1490, 280, "slime3", 10, 15, slimeAnimation3),
      new Enemy(1515, 930, "slime1", 10, 5, slimeAnimation1),
      new Enemy(1750, 615, "slime2", 10, 10, slimeAnimation2)
    ]

    this.obstacles = [
      { x: 435, y: 350, w: 325, h: 465 },
      { x: 1350, y: 360, w: 330, h: 465 },
      //hole { x: 915, y: 830, w: 338, h: 190 }
      {x: 0, y: 0 ,w: 210, h: 632},
      {x: 0, y: 0, w: 407, h: 180},
      {x: 0, y: 632, w: 95, h: 448},
      {x: 0, y: 995, w: this.worldWidth, h: 85},
      {x: 407, y: 0, w: 100, h: 130},
      {x: 505, y: 0, w: 485, h: 180},
      {x: 990, y: 0, w: 250, h: 255},
      {x: 1070, y: 280, w: 80, h: 40},
      {x: 1240, y: 0, w: 740, h: 190},
      {x: 1830, y: 0, w: 150, h: this.worldHeight},
    ];

    this.exitZone = {
      x: 400, y: 80, w: 180, h: 80
    };

    this.holeZone = {
      x: 955, y: 860, w: 250, h: 145
    };
  }

  updateCamera() {
    cameraX = player.x - width / 2;
    cameraY = player.y - height / 2;

    cameraX = constrain(cameraX, 0, this.worldWidth - width);
    cameraY = constrain(cameraY, 0, this.worldHeight - height);
  }

  update() {
    this.movePlayerWithCollisions();

    if (player.hurtTimer > 0) {
      player.hurtTimer--;
    }

    for(let loot of this.lootItems) {
      if (!loot.collected && rectCollision(player,loot)) {
        loot.collect(player);
      }
    }

    if(this.allLootCollected() && this.playerAtExit()) {
      sceneManager.changeScene("hub");
    }

    if (rectCollision (player, this.holeZone)) {
      this.respawnPlayer();
    }

    if (this.respawnFading) {
      this.respawnFadeAlpha -= 5;

      if (this.respawnFadeAlpha <= 0) {
        this.respawnFadeAlpha = 0;
        this.respawnFading = false;
      }
    }

    this.updateCamera();

    for (let enemy of this.slime) {
      enemy.update();
      if (rectCollision(player, enemy) && player.canBeHit()) {
        enemy.attack(player);
        player.registerHit();
      }
    }
  }

  movePlayerWithCollisions() {
    let dx = 0;
    let dy = 0;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      dx = -player.speed;
      player.direction = "side";
      player.isFacingLeft = true;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      dx = player.speed;
      player.direction = "side";
      player.isFacingLeft = false;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      dy = -player.speed;
      player.direction = "back";
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      dy = player.speed;
      player.direction = "front";
    }

    let moved = false;

    let nextXRect = {
      x: player.x + dx,
      y: player.y,
      w: player.w,
      h: player.h
    };

    if (
      player.x + dx >= 0 &&
      player.x + dx + player.w <= worldWidth &&
      !collidesWithAny(nextXRect, this.obstacles)
    ) {
      player.x += dx;
      if (dx !== 0) moved = true;
    }

    let nextYRect = {
      x: player.x,
      y: player.y + dy,
      w: player.w,
      h: player.h
    };

    if (
      player.y + dy >= 0 &&
      player.y + dy + player.h <= worldHeight &&
      !collidesWithAny(nextYRect, this.obstacles)
    ) {
      player.y += dy;
      if (dy !== 0) moved = true;
    }

    player.isMoving = moved;

    if (moved) {
      player.frame += 0.1;
      } else {
        if (player.direction === "side" && animationSideIdle.length > 0) {
        player.frame += 0.05;
        } else {
        player.frame = 0;
      }
    }
  }

  display() {
    background(0);
  
    push();
    translate(- cameraX, - cameraY);

    image(caveMap, 0, 0);

    for (let loot of this.lootItems) {
      loot.display();
    }

    for (let enemy of this.slime) {
      enemy.display();
    }

    player.display();
    
    pop();

    gameUI.drawPlayerPanel(player);

    if (!this.allLootCollected()) {
      this.drawInstruction("Time to find those gems he asked for, Little Hunter");
      } else {
        this.drawInstruction("That should be enough - leave the cave and head to the village!");
    }

    if (this.respawnFadeAlpha > 0) {
      push();
      noStroke();
      fill(0, this.respawnFadeAlpha);
      rect(0, 0, width, height);
      pop();
    }
  }

  allLootCollected() {
    for(let loot of this.lootItems) {
      if (!loot.collected) {
        return false;
      }
    }
    return true;
  }

  playerAtExit() {
    return rectCollision(player, this.exitZone);
  }

  respawnPlayer() {
    player.takeDamage(20);
    player.x = 450;
    player.y = 140;

    player.hurtTimer = 20;

    this.respawnFadeAlpha = 255;
    this.respawnFading = true;

    cameraX = 0;
    cameraY = 0;
  }

  handleKeyPressed(key) {
    if ((key === "n" || key === "N")) {
      sceneManager.changeScene("hub");
    }
  }
}

class HubScene extends BaseScene {
  constructor() {
    super("hub");
    this.worldWidth = 1980;
    this.worldHeight = 1080;
    this.obstacles = [];
    this.npcs = [];
    this.animals = [];

    this.activeNpc = null;
    this.dialogueBox = null;
    this.inDialogue = false;
  }

  enter () {
    player.x = 100;
    player.y = 500;

    this.npcs = [
      new NPC(1710, 440, "Blacksmith", "Blacksmith", npcAnimation1, ["Little Hunter!", "I'm glad you recieved my letter!", "Did you find the gems I asked for?", "Great news! Let me get this weapon ready for you.", "You're going to need to defend yourself!", "Head East, I know the beast is in the forest above the cliffs..."]), 
      new NPC(1605, 780, "Villager", "Villager", npcAnimation2, ["Hhhmm...", "The water is gone.","Must be those pesky monsters!", "They've been messing with our village for weeks!"]),
      new NPC(315, 465, "Farmer1", "Farmer1", npcAnimation3, ["Hi Little Hunter.", "You must be looking for our blacksmith?", "Head further into the village and you'll find him!"]),
      new NPC(1180, 450, "Couple1", "Couple", npcAnimation4, ["Be careful around here Little Hunter.", "There have been rumors of monsters near these parts..."]),
      new NPC(1220, 450, "Couple2", "Couple", npcAnimation5, ["...", "Come dear, let's head back inside..."]),
      new NPC(1090, 790, "Farmer2", "Farmer2", npcAnimation6, ["The animals are restless Little Hunter.", "Can you feel it too?"])
    ];

    this.animals = [
      new StaticAnimal(440, 860, sheep2Animation),
      new StaticAnimal(950, 790, sheep1Animation),
      new MovingAnimal(610, 900, cowIdleAnimation, cowWalkAnimation, 540, 890)
    ]

    this.obstacles = [
      {x: 0, y: 0, w: 364, h: 430},
      {x: 0, y: 0, w: this.worldWidth, h: 234},
      {x: 420, y: 0, w: 342, h: 430},
      {x: 832, y: 0, w: 256, h: 530},
      {x: 1088, y: 0, w: 200, h: 440},
      {x: 1288, y: 0, w: 273, h: 470},
      {x: 1585, y: 0, w: 70, h: 460},
      {x: 1655, y: 0, w: 115, h: 410},
      {x: 1770, y: 0, w: 155, h: 460},
      {x: 1460, y: 690, w: 135, h: 110},
      {x: 0, y: 1000, w: this.worldWidth, h: 80},
      {x: 295, y: 630, w: 300, h: 345},
      {x: 590, y: 710, w: 485, h: 275}
    ];
  }

  updateCamera() {
    cameraX = player.x - width / 2;
    cameraY = player.y - height / 2;

    cameraX = constrain(cameraX, 0, this.worldWidth - width);
    cameraY = constrain(cameraY, 0, this.worldHeight - height);
  }

  movePlayerWithCollisions() {
    let dx = 0;
    let dy = 0;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      dx = -player.speed;
      player.direction = "side";
      player.isFacingLeft = true;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      dx = player.speed;
      player.direction = "side";
      player.isFacingLeft = false;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      dy = -player.speed;
      player.direction = "back";
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      dy = player.speed;
      player.direction = "front";
    }

    let moved = false;

    let nextXRect = {
      x: player.x + dx,
      y: player.y,
      w: player.w,
      h: player.h
    };

    if (
      player.x + dx >= 0 &&
      player.x + dx + player.w <= worldWidth &&
      !collidesWithAny(nextXRect, this.obstacles)
    ) {
      player.x += dx;
      if (dx !== 0) moved = true;
    }

    let nextYRect = {
      x: player.x,
      y: player.y + dy,
      w: player.w,
      h: player.h
    };

    if (
      player.y + dy >= 0 &&
      player.y + dy + player.h <= worldHeight &&
      !collidesWithAny(nextYRect, this.obstacles)
    ) {
      player.y += dy;
      if (dy !== 0) moved = true;
    }

    player.isMoving = moved;

    if (moved) {
      player.frame += 0.1;
      } else {
        if (player.direction === "side" && animationSideIdle.length > 0) {
        player.frame += 0.05;
        } else {
        player.frame = 0;
      }
    }
  }

  npcProximityTest() {
    for (let npc of this.npcs) {
      let d = dist(player.x, player.y, npc.x, npc.y);
      if(d < 50) {
        return npc;
      }
    }
    return null;
  }

  update() {
    if (!this.inDialogue){
      this.movePlayerWithCollisions();
      this.updateCamera();
    }

    for(let npc of this.npcs) {
      npc.update();
    }

    for(let animal of this.animals) {
      animal.update();
    }
  }

  display() {
    background(0);

    push();
    translate(-cameraX, -cameraY);

    image(villageMap, 0, 0);

    for(let npc of this.npcs) {
      npc.display();
    }

    for(let animal of this.animals) {
      animal.display();
    }

    player.display();
    
    pop();

    gameUI.drawPlayerPanel(player);
    
    let nearbyNPC = this.npcProximityTest();

    if (!this.inDialogue && nearbyNPC) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Press E to talk", width / 2, height - 100);
    }

    if (this.dialogueBox) {
      this.dialogueBox.draw(true);
    }
  }

  handleKeyPressed(key) {
    if (key === "n" || key === "N") {
      sceneManager.changeScene("weaponCutscene");
    }

    if (this.inDialogue) {
      if (key === " ") {
        if(!this.dialogueBox.isLineFinished()) {
          this.dialogueBox.finishLine();
        } else { 
          this.dialogueBox.nextLine();

          if (this.dialogueBox.outOfLines) {
            let finishedNPC = this.activeNpc;

            this.inDialogue = false;
            this.activeNpc = null;
            this.dialogueBox = null;

            if (finishedNPC && finishedNPC.dialogueId === "Blacksmith") {
              gameManager.hasWeapon = true;
              sceneManager.changeScene("weaponCutscene");
            }
          }
        }
      }
      return;
    }

    if (key === "e" || key === "E") {
      let nearbyNPC = this.npcProximityTest();

      if (nearbyNPC) {
        this.activeNpc = nearbyNPC;
        this.dialogueBox = new DialogueBox(nearbyNPC.dialogueLines);
        this.inDialogue = true;
      }
    }
  }
}

class BattleScene extends BaseScene {
  constructor() {
    super("battle");
    this.groundY = 490;
    this.playerStartX = 150;
    this.playerStartY = 0;
    this.bossStartX = 800;
    this.bossStartY = 0;
  }

  enter() {
    this.battlePlayer = new BattlePlayer(this.playerStartX, 0);
    this.battlePlayer.y = this.groundY - this.battlePlayer.h;
    this.battlePlayer.money = player.money;

    this.boss = new BossEnemy(this.bossStartX, 0);
    this.boss.y = this.groundY - this.boss.h;
  }

  update() {
    // Always update both so death animations can continue
    this.battlePlayer.update(this.groundY);
    this.boss.update(this.battlePlayer, this.groundY);

    // Trigger player death once
   if (this.battlePlayer.health <= 0 && !this.battlePlayer.isDead) {
      this.battlePlayer.death();
    }

    // Combat only while both are alive
    if (!this.battlePlayer.isDead && !this.boss.isDead) {
      let playerAttack = this.battlePlayer.getAttackBox();
      if (playerAttack && rectCollision(playerAttack, this.boss)) {
        this.boss.takeDamage(8);
        console.log("boss enemy hit", this.boss.health);
      }

      let bossAttack = this.boss.getAttackBox();
      if (
       bossAttack &&
        rectCollision(this.battlePlayer, bossAttack) &&
        this.battlePlayer.canBeHit()
      )   {
        this.battlePlayer.takeDamage(this.boss.damage);
        this.battlePlayer.registerHit();
        console.log("player hit", this.battlePlayer.health)
      }
    }
    

    // Wait for player death animation to finish
    if (this.battlePlayer.isDead) {
      let playerDeathFinished =
        floor(this.battlePlayer.frame) >= battlePlayerDeath.length - 1;

      if (playerDeathFinished) {
        gameManager.gameOver = true;
        sceneManager.changeScene("GameOver");
      }
      return;
    }

    // Wait for boss death animation to finish
    if (this.boss.isDead) {
      let bossDeathFinished =
        floor(this.boss.frame) >= bossDeath.length - 1;

      if (bossDeathFinished) {
        gameManager.gameWon = true;
        sceneManager.changeScene("winner");
      }
      return;
    }
  }

  display() {
    background(0);

    if (bossBackground) {
      image(bossBackground, 0, 0, width, height);
    }

    this.battlePlayer.display();
    this.boss.display();
    gameUI.drawPlayerPanel(this.battlePlayer);
    gameUI.drawBossPanel(this.boss);
  }

  

  handleKeyPressed(key) {
    if (key === " ") {
      this.battlePlayer.jump();
    }

    if (key === "e" || key === "E" || keyCode === 69) {
      this.battlePlayer.attack();
    }

    if (key === "n" || key === "N") {
      sceneManager.changeScene("winner");
    }
  }
}
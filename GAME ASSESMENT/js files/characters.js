class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {}

  display() {
    rect(this.x, this.y, this.w, this.h);
  }
}

class Character extends Entity {
  constructor(x, y, w, h, name, maxHealth = 100) {
    super(x, y, w, h);
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
  }

  takeDamage(amount) {
    this.health = max(0, this.health - amount);
  }
}

class Player extends Character {
  constructor(x, y) {
    super(x, y, 32, 32, "Player", 100);
    this.money = 0;
    this.damage = 10;
    this.speed = 2;
    this.lastHitTime = 0;
    this.hitCooldown = 800;
    this.hurtTimer = 0;

    this.isFacingLeft = false;
    this.direction = "side";
    this.isMoving = false;
    this.frame = 0;
  }

  move() {
    let isMoving = false;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.speed;
      this.direction = "side";
      this.isFacingLeft = true;
      isMoving = true;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
      this.direction = "side";
      this.isFacingLeft = false;
      isMoving = true;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.y -= this.speed;
      this.direction = "back";
      isMoving = true;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.y += this.speed;
      this.direction = "front";
      isMoving = true;
    }

    this.x = constrain(this.x, 0, worldWidth - this.w);
    this.y = constrain(this.y, 0, worldHeight - this.h);

    this.isMoving = isMoving

    if (isMoving) {
      this.frame += 0.15;
    } else {
      this.frame += 0.05;
    }
  }

  update() {
    this.move();
  }

  addMoney(amount) {
    this.money += amount;
  }

  canBeHit () {
    return millis() - this.lastHitTime > this.hitCooldown;
  }

  registerHit () {
    this.lastHitTime = millis();
    this.hurtTimer = 12;
  }

  display() {
    let currentAnimation;

    if (this.direction === "front") {
    currentAnimation = animationFront;
    } else if (this.direction === "back") {
    currentAnimation = animationBack;
    } else {
      if (this.isMoving || animationSideIdle.length === 0) {
        currentAnimation = animationSide;
    } else {
      currentAnimation = animationSideIdle;
    }
    }

    if (!currentAnimation || currentAnimation.length === 0) {
      fill(50, 150, 255);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let index = floor(this.frame) % currentAnimation.length;

    let shouldDraw = true;

    if (this.hurtTimer > 0) {
      shouldDraw = frameCount % 4 < 2;
    }

    if (shouldDraw) {
      push();
      imageMode(CENTER);
      translate(this.x + this.w / 2, this.y + this.h / 2);

      if (this.isFacingLeft && this.direction === "side") {
        scale(-1, 1);
      }
    }

    image(currentAnimation[index], 0, 0, this.w*2, this.h*2);
    
    pop();
    noTint();
    imageMode(CORNER);
  }
}

class BattlePlayer extends Character {
  constructor(x, y) {
    super(x, y, 34, 52, "BattlePlayer", 100);
    this.money = 0;

    this.frame = 0;
    this.animationSpeed = 0.1;

    this.vx = 0;
    this.vy = 0;

    this.speed = 4;
    this.jumpStrength = -12;
    this.gravity = 0.6;
    this.onGround = false;

    this.facing = "right";

    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackCooldown = 0;

    this.lastHitTime = 0;
    this.hitCooldown = 800;
    this.hurtTimer = 0;

    this.isDead = false;

    // visual sprite size (separate from hitbox)
    this.drawW = 64;
    this.drawH = 64;
    this.drawOffsetX = (this.w - this.drawW) / 2;
    this.drawOffsetY = this.h - this.drawH;
  }

  movement () {
    this.vx = 0;

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      this.vx = -this.speed;
      this.facing = "left";
    }

    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      this.vx = this.speed;
      this.facing = "right";
    }
  }
  
  jump () {
    if (this.onGround) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }
  }

  attack () {
    if (this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.attackTimer = 20;
      this.attackCooldown = 25;
      this.frame = 0;
    }
  }

  canBeHit () {
    return millis() - this.lastHitTime > this.hitCooldown;
  }

  registerHit () {
    this.lastHitTime = millis();
    this.hurtTimer = 12;
  }

  death() {
    if (!this.isDead) {
      this.isDead = true;
      this.frame = 0;
      this.vx = 0;
      this.vy = 0;
      this.isAttacking = false;
    }
  }

  update(groundY) {
    if (this.isDead) {
      this.frame += 0.12;
      return;
    }
    
    this.movement();

    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.x = constrain(this.x, 0, width - this.w);

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }

    if (this.attackTimer > 0) {
      this.attackTimer--;
    } else {
      this.isAttacking = false;
    }

    if (this.isAttacking) {
      this.frame += 0.25;
    } else {
      this.frame += this.animationSpeed;
    }

    if (this.hurtTimer > 0) {
      this.hurtTimer--;
    };
  }

  getAttackBox () {
    if (!this.isAttacking) return null;

    if (this.facing === "right") {
      return {
        x: this.x - 10,
        y: this.y - 10,
        w: this.w + 30,
        h: this.h + 30
      };
    } else {
      return {
        x: this.x - 35,
        y: this.y - 35,
        w: this.w + 30,
        h: this.h + 30
      };
    }
  }

  getCurrentAnimation() {
    if (this.health <= 0) return battlePlayerDeath;
    if (this.isAttacking) return battlePlayerAttack;
    if (!this.onGround) return battlePlayerJump;
    if (this.vx !== 0) return battlePlayerRun;
    return battlePlayerIdle;
    }

  display() {
    let currentAnimation = this.getCurrentAnimation();

    if (!currentAnimation || currentAnimation.length === 0) {
     fill(255, 0, 0);
     rect(this.x, this.y, this.w, this.h);
     return;
    }

    let index;
    if (this.isDead) {
      index = min(floor(this.frame), currentAnimation.length - 1);
    } else {
      index = floor(this.frame) % currentAnimation.length;
    }

    let frameImg = currentAnimation[index];

    if (!frameImg) {
      fill(255, 0, 0);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let shouldDraw = true;
    if (this.hurtTimer > 0) {
      shouldDraw = frameCount % 4 < 2;
    }
    if (!shouldDraw) return;

    push();
    imageMode(CORNER);

    if (this.facing === "left") {
      translate(this.x + this.drawOffsetX + this.drawW, this.y + this.drawOffsetY);
      scale(-1, 1);
      image(frameImg, 0, 0, this.drawW, this.drawH);
    } else {
      image(
      frameImg,
      this.x + this.drawOffsetX,
      this.y + this.drawOffsetY,
      this.drawW,
      this.drawH
    );
    }

    pop();
  }
}


class NPC extends Character {
  constructor(x, y, name, dialogueId, animationFrames = [], dialogueLines = []) {
    super(x, y, 64, 64, name, 100);
    this.dialogueId = dialogueId;
    this.animationFrames = animationFrames;
    this.dialogueLines = dialogueLines;

    this.frame = 0;
    this.animationSpeed = 0.08;
  }

  update () {
    if (this.animationFrames.length > 0) {
      this.frame += this.animationSpeed;
    }
  }

  display () {
      if (!this.animationFrames || this.animationFrames.length === 0) {
        fill(180, 180, 180);
        rect(this.x, this.y, this.w, this.h);
        return;
    }

    let index = floor(this.frame) % this.animationFrames.length;

    imageMode(CORNER);
    image(this.animationFrames[index], this.x - 16, this.y - 56, 64, 80);
    }
  }

class Enemy extends Character {
  constructor(x, y, name, maxHealth, damage, animationFrames = []) {
    super(x, y, 15, 15, name, maxHealth);
    this.damage = damage;
    this.animationFrames = animationFrames;
    this.frame = 0;
    this.animationSpeed = 0.08;

    this.drawW = 96;
    this.drawH = 96;
    this.drawOffsetX = -32;
    this.drawOffsetY = -32;
  }

  update () {
    if(this.animationFrames.length > 0) {
      this.frame += this.animationSpeed;
    }
  }

  display () {
    if (!this.animationFrames || this.animationFrames.length === 0) {
      fill(180, 180, 180);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let index = floor(this.frame) % this.animationFrames.length;

    imageMode(CORNER);
    image(this.animationFrames[index],this.x + this.drawOffsetX, this.y + this.drawOffsetY, this.drawW, this.drawH
    );
    }
  
  attack(player) {
    player.takeDamage(this.damage);
  }
}

class BossEnemy extends Character {
  constructor(x, y) {
    super(x, y, 60, 70, "Boss", 200);

    this.vx = 0;
    this.speed = 1.5;
    this.damage = 5;

    this.state = "run";
    this.previousState = "";
    this.frame = 0;
    this.animationSpeed = 0.12;

    this.facing = "left";
    this.attackFacing = "left";

    this.attackCooldown = 0;
    this.attackTimer = 0;
    this.isAttacking = false;

    this.lastHitTime = 0;
    this.hitCooldown = 250;
    this.hurtTimer = 0;

    this.isDead = false;

    this.drawW = 220;
    this.drawH = 220;
    this.drawOffsetX = -85;
    this.drawOffsetY = -50;
  }

  setState(newState) {
    if (this.state !== newState) {
      this.previousState = this.state;
      this.state = newState;
      this.frame = 0;
    }
  }

  getCurrentAnimation() {
    if (this.state === "attack1") return bossAttack1;
    if (this.state === "attack2") return bossAttack2;
    if (this.state === "death") return bossDeath;
    return bossRun;
  }

  canBeHit() {
    return millis() - this.lastHitTime > this.hitCooldown;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    if (!this.canBeHit()) return;

    this.lastHitTime = millis();
    this.health = max(0, this.health - amount);
    this.hurtTimer = 10;

    if (this.health <= 0) {
      this.isDead = true;
      this.setState("death");
    }
  }

  update(player, groundY) {
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.attackTimer > 0) this.attackTimer--;
    if (this.hurtTimer > 0) this.hurtTimer--;

    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
    }

    if (this.isDead) {
      this.frame += 0.08;
      return;
    }

    let distanceX = player.x - this.x;
    let absDistance = abs(distanceX);

    if (!(this.state === "attack1" || this.state === "attack2")) {
      this.facing = distanceX < 0 ? "left" : "right";
    }

    if (this.state === "attack1" || this.state === "attack2") {
      this.frame += 0.2;

      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.setState("run");
      }

      return;
    }

    if (absDistance > 70) {
      this.setState("run");

      if (distanceX < 0) {
        this.x -= this.speed;
      } else {
        this.x += this.speed;
      }
    } else {
      if (this.attackCooldown <= 0) {
        this.attackFacing = this.facing;

        if (random() < 0.5) {
          this.setState("attack1");
        } else {
          this.setState("attack2");
        }

        this.isAttacking = true;
        this.attackTimer = 40;
        this.attackCooldown = 150;
      } else {
        this.setState("run");
      }
    }

    this.x = constrain(this.x, 0, width - this.w);

    this.frame += this.animationSpeed;
  }

  getAttackBox() {
    if (!this.isAttacking || this.isDead) return null;

    if (this.state === "attack1") {
      if (this.attackFacing === "right") {
        return {
          x: this.x + this.w - 4,
          y: this.y + 56,
          w: 42,
          h: 16
        };
      } else {
        return {
          x: this.x - 38,
          y: this.y + 56,
          w: 42,
          h: 16
        };
      }
    }

  if (this.state === "attack2") {
    if (this.attackFacing === "right") {
      return {
        x: this.x + this.w - 4,
        y: this.y + 52,
        w: 58,
        h: 20
      };
      
    } else {
      return {
        x: this.x - 54,
        y: this.y + 52,
        w: 58,
        h: 20
      };
    }
  }
  return null;
}



  display() {
    let currentAnimation = this.getCurrentAnimation();

    if (!currentAnimation || currentAnimation.length === 0) {
      fill(120, 0, 200);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let index = floor(this.frame) % currentAnimation.length;

    if (this.state === "death") {
      index = min(floor(this.frame), currentAnimation.length - 1);
    }

    let frameImg = currentAnimation[index];

    if (!frameImg) {
      fill(120, 0, 200);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let shouldDraw = true;
    if (this.hurtTimer > 0) {
      shouldDraw = frameCount % 4 < 2;
    }

    if (shouldDraw) {
      push();
      imageMode(CORNER);

      if (this.facing === "left") {
        translate(this.x + this.drawOffsetX + this.drawW, this.y + this.drawOffsetY);
        scale(-1, 1);
        image(frameImg, 0, 0, this.drawW, this.drawH);
      } else {
        image(
          frameImg,
          this.x + this.drawOffsetX,
          this.y + this.drawOffsetY,
          this.drawW,
          this.drawH
        );
      }

      pop();
    }
  }
} 


class Animal extends Entity {
  constructor(x, y, w, h, animationFrames) {
    super(x, y, w, h);
    this.animationFrames = animationFrames;
    this.frame = 0;
    this.animationSpeed = 0.08;

    this.drawW = w * 2;
    this.drawH = h * 2;
    this.drawOffsetX = 0;
    this.drawOffsetY = 0;

    this.isFacingLeft = false;
  }

  updateAnimation () {
    if(this.animationFrames && this.animationFrames.length > 0) {
      this.frame += this.animationSpeed;
    }
  }

  update () {
    this.updateAnimation();
  }

  display () {
    if (!this.animationFrames || this.animationFrames.length === 0) {
        fill(180, 180, 180);
        rect(this.x, this.y, this.w, this.h);
        return;
    }

    let index = floor(this.frame) % this.animationFrames.length;

    push();
    imageMode(CORNER);
    
    if(this.isFacingLeft) {
      translate(this.x + this.drawOffsetX + this.drawW, this.y + this.drawOffsetY);
      scale(-1, 1);
      image(this.animationFrames[index], 0, 0, this.drawW, this.drawH);
      } else {
        image(this.animationFrames[index],this.x + this.drawOffsetX,this.y + this.drawOffsetY,this.drawW,this.drawH);
    }

    pop();
    }
  }

class StaticAnimal extends Animal {
  constructor(x, y, animationFrames = []) {
    super(x, y, 32, 32, animationFrames);
    this.drawW = 64;
    this.drawH = 64;
    this.drawOffsetX = -16;
    this.drawOffsetY = -24;
  }
}

class MovingAnimal extends Animal {
  constructor(x, y, idleFrames = [], walkFrames = [], minX = x - 80, maxX = x + 80) {
    super(x, y, 32, 32, []);

    this.idleFrames = idleFrames;
    this.walkFrames = walkFrames;

    this.state = "idle";
    this.frame = 0;
    this.animationSpeed = 0.08;

    this.drawW = 160;
    this.drawH = 160;
    this.drawOffsetX = -40;
    this.drawOffsetY = -56;

    this.minX = minX;
    this.maxX = maxX;

    this.speed = 0.6;
    this.direction = 1;
    this.isFacingLeft = false;

    this.stateTimer = 0;
    this.pickNewState();
  }

  getCurrentFrames() {
    if (this.state === "walk") {
      return this.walkFrames;
    }
    return this.idleFrames;
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.frame = 0;
    }
  }

  pickNewState() {
    if (random() < 0.5) {
      this.setState("idle");
      this.stateTimer = int(random(90, 180));
    } else {
      this.setState("walk");
      this.stateTimer = int(random(80, 160));
      this.direction = random() < 0.5 ? -1 : 1;
      this.isFacingLeft = this.direction < 0;
    }
  }

  update() {
    let frames = this.getCurrentFrames();
    if (frames.length > 0) {
      this.frame += this.animationSpeed;
    }

    if (this.state === "walk") {
      this.x += this.speed * this.direction;

      if (this.x <= this.minX) {
        this.x = this.minX;
        this.direction = 1;
        this.isFacingLeft = false;
        this.setState("idle");
        this.stateTimer = int(random(30, 90));
      }

      if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.direction = -1;
        this.isFacingLeft = true;
        this.setState("idle");
        this.stateTimer = int(random(30, 90));
      }
    }

    this.stateTimer--;

    if (this.stateTimer <= 0) {
      this.pickNewState();
    }
  }

  display() {
    let frames = this.getCurrentFrames();

    if (!frames || frames.length === 0) {
      fill(220);
      rect(this.x, this.y, this.w, this.h);
      return;
    }

    let index = floor(this.frame) % frames.length;

    push();
    imageMode(CORNER);

    if (this.isFacingLeft) {
      translate(this.x + this.drawOffsetX + this.drawW, this.y + this.drawOffsetY);
      scale(-1, 1);
      image(frames[index], 0, 0, this.drawW, this.drawH);
    } else {
      image(
        frames[index],
        this.x + this.drawOffsetX,
        this.y + this.drawOffsetY,
        this.drawW,
        this.drawH
      );
    }

    pop();
  }
}
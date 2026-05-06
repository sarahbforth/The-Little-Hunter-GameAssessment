class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentSceneName = "";

    this.isTransitioning = false;
    this.fadeAlpha = 0;
    this.fadeSpeed = 15;
    this.transitionPhase = "none"; // "fadeOut", "fadeIn", "none"
    this.nextSceneName = null;
  }

  addScene(name, scene) {
    this.scenes[name] = scene;
  }

  changeScene(name) {
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" does not exist.`);
      return;
    }

    if (this.currentSceneName === name || this.isTransitioning) {
      return;
    }

    this.nextSceneName = name;
    this.isTransitioning = true;
    this.transitionPhase = "fadeOut";
  }

  forceSceneChange(name) {
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" does not exist.`);
      return;
    }

    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = this.scenes[name];
    this.currentSceneName = name;
    this.currentScene.enter();
  }

  update() {
    if (this.currentScene) {
      this.currentScene.update();
    }

    this.updateFade();
  }

  display() {
    if (this.currentScene) {
      this.currentScene.display();
    }

    this.drawFade();
  }

  handleKeyPressed(key) {
    if (this.currentScene && !this.isTransitioning) {
      this.currentScene.handleKeyPressed(key);
    }
  }

  handleMousePressed() {
    if (this.currentScene && !this.isTransitioning) {
      this.currentScene.handleMousePressed();
    }
  }

  updateFade() {
    if (!this.isTransitioning) return;

    if (this.transitionPhase === "fadeOut") {
      this.fadeAlpha += this.fadeSpeed;

      if (this.fadeAlpha >= 255) {
        this.fadeAlpha = 255;
        this.forceSceneChange(this.nextSceneName);
        this.transitionPhase = "fadeIn";
      }
    } else if (this.transitionPhase === "fadeIn") {
      this.fadeAlpha -= this.fadeSpeed;

      if (this.fadeAlpha <= 0) {
        this.fadeAlpha = 0;
        this.isTransitioning = false;
        this.transitionPhase = "none";
        this.nextSceneName = null;
      }
    }
  }

  drawFade() {
    if (this.fadeAlpha > 0) {
      push();
      noStroke();
      fill(0, this.fadeAlpha);
      rect(0, 0, width, height);
      pop();
    }
  }
}

class GameManager {
  constructor() {
    this.runNumber = 1;
    this.questActive = false;
    this.questComplete = false;
    this.gameWon = false;
    this.gameOver = false;
    this.hasWeapon = false;
  }

  resetRun() {
    this.questActive = false;
    this.questComplete = false;
    this.gameWon = false;
    this.gameOver = false;
    this.hasWeapon = false;
  }
}
/**
 * SceneManager controls which scene is currently active.
 * Handles smooth transition using fade
 * 
 * Stores scenes / switching / active scene / display / transitions
 */
class SceneManager {
  /**
   * Scene storage / tracking / fade variables
   */
  constructor() {
    this.scenes = {}; //stores all scenes by name

    this.currentScene = null;
    this.currentSceneName = "";

    this.isTransitioning = false; //transition state
    this.fadeAlpha = 0;
    this.fadeSpeed = 15;
    this.transitionPhase = "none"; // "fadeOut", "fadeIn", "none"
    this.nextSceneName = null;
  }

  /**
   * Add scene to the manager
   * @param {string} name - name of scene
   * @param {Object} scene - scene to store
   */
  addScene(name, scene) {
    this.scenes[name] = scene;
  }

  /**
   * Fade transition
   * @param {string} name - next scene
   */
  changeScene(name) {
    //can't switch if it doesnt exist
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" does not exist.`);
      return;
    }

    //no repeats or false starts
    if (this.currentSceneName === name || this.isTransitioning) {
      return;
    }

    this.nextSceneName = name;
    this.isTransitioning = true;
    this.transitionPhase = "fadeOut";
  }
 /**
  * Immediate switch with no fade (developer shortcut mostly)
  * @param {string} name - next target scene
  * @returns 
  */
  forceSceneChange(name) {
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" does not exist.`);
      return;
    }

    if (this.currentScene) {
      this.currentScene.exit();
    }

    //set new scene
    this.currentScene = this.scenes[name];
    this.currentSceneName = name;
    this.currentScene.enter();
  }

  /**
   * update frames and transition
   */
  update() {
    if (this.currentScene) {
      this.currentScene.update();
    }

    this.updateFade();
  }
 /**
  * Display method and fade overlay
  */
  display() {
    if (this.currentScene) {
      this.currentScene.display();
    }

    this.drawFade();
  }

  /**
   * Keyboard input for current scene
   * @param {string} key - key pressed
   */
  handleKeyPressed(key) {
    if (this.currentScene && !this.isTransitioning) {
      this.currentScene.handleKeyPressed(key);
    }
  }

  /**
   * Mouse input for current scene
   */
  handleMousePressed() {
    if (this.currentScene && !this.isTransitioning) {
      this.currentScene.handleMousePressed();
    }
  }

  /**
   * Update fade effect
   * 
   * fadeOut - slowly to black
   * fadeIn - screen to normal
   */
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

  /**
   * Black screen rectangle for fade effect
   */
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

/**
 * Stores game progression and conditions
 */
class GameManager {
  /**
   * Default game state
   */
  constructor() {
    this.runNumber = 1;
    this.questActive = false;
    this.questComplete = false;
    this.gameWon = false;
    this.gameOver = false;
    this.hasWeapon = false;
  }

  /**
   * Resets for a new run
   */
  resetRun() {
    this.questActive = false;
    this.questComplete = false;
    this.gameWon = false;
    this.gameOver = false;
    this.hasWeapon = false;
  }
}
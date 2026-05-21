/**
 * Preload game assets and data
 */
function preload() {
  dialogueFont = loadFont("assets/Jersey10-Regular.ttf");

  spriteData = loadJSON("assets/4-DATA/hood-figure.json");
  spriteSheet = loadImage("assets/Hooded-Figure.png");
  spriteDataFront = loadJSON("assets/4-DATA/hood-figure-front.json");
  spriteSheetFront = loadImage("assets/Hooded-Figure-front.png");
  spriteDataBack = loadJSON("assets/4-DATA/hood-figure-back.json");
  spriteSheetBack = loadImage("assets/Hooded-Figure-back.png");

  cutscene1 = loadImage("assets/Artboard 1.png");
  letterCutscene = loadImage("assets/LetterCutscene.png");

  caveMap = loadImage("assets/CAVEMAP.png");
  gemImg = loadImage("assets/crystal.png");
  slimeData = loadJSON("assets/4-DATA/enemies.json");
  slimeSheet1 = loadImage("assets/Slime1.png");
  slimeSheet2 = loadImage("assets/Slime2.png");
  slimeSheet3 = loadImage("assets/Slime3.png");

  npcData = loadJSON("assets/4-DATA/NPC.json");
  npcSheet = loadImage("assets/Male3.png");
  npcSheet2 = loadImage("assets/Female2.png");
  npcSheet3 = loadImage("assets/Male1.png");
  villageMap = loadImage("assets/VILLAGE.png");
  animalData = loadJSON("assets/4-DATA/animals.json");
  sheepSheet = loadImage("assets/Sheep.png");
  cowSheet = loadImage("assets/Bull.png") //lol

  weaponCutscene = loadImage("assets/Weapon.png");

  bossBackground = loadImage("assets/BattleArena.png");
  battlePlayerData = loadJSON("assets/4-DATA/BattlePlayer.json");
  bossSprite = loadImage("assets/Boss.png");
  bossData = loadJSON("assets/4-DATA/Boss.json");

  gameOver = loadImage("assets/GameOver.png");
  winner = loadImage("assets/Winner!.png");
}  

/**
 * Initialise scene structure and game manegement
 */
function setup() {
  createCanvas(960, 540);
  textFont(dialogueFont);

  gameManager = new GameManager();
  sceneManager = new SceneManager();
  gameUI = new GameUI();

  sceneManager.addScene("title", new TitleScene());
  sceneManager.addScene(
    "cutscene1",
    new CutsceneScene(
      "cutscene1",
      "Cutscene 1",
      ["Hello, little hunter!",
       "Looks like you have a letter there.",
       "What does it say?"
      ],
      "letter",
      cutscene1
    )
  );

  sceneManager.addScene(
    "letter", 
    new CutsceneScene(
      "letter", 
     "The Letter", 
      ["To the Little Hunter...",
       "I am a Blacksmith of the local cliffside villages.",
       "Tales of your quests have reached far and wide, I am requesting your help.",
       "Shadows have taken root in the forests and they are too dangerous.",
       "We are not strong enough to fight them, we need you!",
       "Please come to see me at my shop, I will traid gems for a weapon should you need.",
       "I have heard the cliffside caves provide more than enough!",
       "Safe travels, I hope to see you soon.",
       "The Blacksmith"
      ],
      "location1",
     letterCutscene
    )
  )

  sceneManager.addScene("location1", new ExploreScene());
  sceneManager.addScene("hub", new HubScene());
  sceneManager.addScene("weaponCutscene", new CutsceneScene(
    "weaponCutscene",
    "WeaponCutscene",
    ["Looks like the Blacksmith was true to his word, Little Hunter!",
      "Are you ready to face the monsters?",
      "Good luck!"
    ],
    "battle",
    weaponCutscene
    )
  );

  sceneManager.addScene("battle", new BattleScene());
  sceneManager.addScene("GameOver", new CutsceneScene(
    "GameOver",
    "GameOver",
    ["You look tired, Little Hunter...",
      "Maybe thats enough for today, lets try again tomorrow..."
    ],
    "title",
    gameOver
    )
  );
  sceneManager.addScene("winner", new CutsceneScene(
    "winner",
    "winner",
    ["You did it, Little Hunter!",
      "The shadows have gone, you brought the sun back out!",
      "Congratulations, I'm proud of you.",
      "Onto our next adventure, yes?"
    ],
    "title",
    winner
    )
  )

  player = new Player(100,100);

  sceneManager.forceSceneChange("title");

  //animation loops to fill correct arrays
  let frameData = spriteData.frames;
    for (let i = 0; i < frameData.length; i++) {
      let frame = frameData[i];
      let pos = frame.position;
      let img = spriteSheet.get(pos.x, pos.y, pos.w, pos.h);

      if (frame.name.startsWith("idle-")) {
        animationSideIdle.push(img);
      } else {
        animationSide.push(img);
      }
    }

  let frameDataFront = spriteDataFront.frames;
    for (let i = 0; i < frameDataFront.length; i++) {
      let pos = frameDataFront[i].position;
      let img = spriteSheetFront.get(pos.x, pos.y, pos.w, pos.h);
      animationFront.push(img);
    }
  
  let frameDataBack = spriteDataBack.frames;
    for (let i = 0; i < frameDataBack.length; i++){
      let pos = frameDataBack[i].position;
      let img = spriteSheetBack.get(pos.x, pos.y, pos.w, pos.h);
      animationBack.push(img);
    }

  let npcFrames = npcData.frames;
    for (let i = 0; i < npcFrames.length; i++){
      let frame = npcFrames[i];
      let pos = frame.position;
      let img = npcSheet.get(pos.x, pos.y, pos.w, pos.h);

      if (frame.name.startsWith("npc1-")) {
          npcAnimation1.push(img);
        } else if (frame.name.startsWith("npc2-")) {
          npcAnimation2.push(img);
        } else if (frame.name.startsWith("npc3-")) {
          let img = npcSheet2.get(pos.x, pos.y, pos.w, pos.h);
          npcAnimation3.push(img);
        } else if (frame.name.startsWith("npc4-")) {
          let img = npcSheet2.get(pos.x, pos.y, pos.w, pos.h);
          npcAnimation4.push(img);
        } else if (frame.name.startsWith("npc5-")) {
          let img = npcSheet3.get(pos.x, pos.y, pos.w, pos.h);
          npcAnimation5.push(img);
        } else if (frame.name.startsWith("npc6-")) {
          let img = npcSheet3.get(pos.x, pos.y, pos.w, pos.h);
          npcAnimation6.push(img);
        }
    }
  
  let slimeFrames = slimeData.frames;
    for( let i = 0; i < slimeFrames.length; i++){
      let frame = slimeFrames[i];
      let pos = frame.position;
      
      if (frame.name.startsWith("slime1-")) {
        let img = slimeSheet1.get(pos.x, pos.y, pos.w, pos.h);
        slimeAnimation1.push(img);
      } else if (frame.name.startsWith("slime2-")) {
        let img = slimeSheet2.get(pos.x, pos.y, pos.w, pos.h);
        slimeAnimation2.push(img)
      } else if (frame.name.startsWith("slime3-")) {
        let img = slimeSheet3.get(pos.x, pos.y, pos.w, pos.h);
        slimeAnimation3.push(img);
      }
    }

  let sheepFrames = animalData.frames;
    for (let i = 0; i < sheepFrames.length; i++) {
      let frame = sheepFrames[i];
      let pos = frame.position;
      let img = sheepSheet.get(pos.x, pos.y, pos.w, pos.h);
      
      if(frame.name.startsWith("sheep1-")) {
        sheep1Animation.push(img);
      } else if (frame.name.startsWith("sheep2")) {
        sheep2Animation.push(img);
      }
  }

  let cowFrames = animalData.frames;
    for (let i = 0; i < cowFrames.length; i++) {
      let frame = cowFrames[i];
      let pos = frame.position;
      let img = cowSheet.get(pos.x, pos.y, pos.w, pos.h);
      
      if(frame.name.startsWith("cowIdle-")) {
        cowIdleAnimation.push(img);
      } else if (frame.name.startsWith("cowWalk-")) {
        cowWalkAnimation.push(img);
      }
  }

  let battleFrames = battlePlayerData.frames;
    for (let i = 0; i < battleFrames.length; i++) {
      let frame = battleFrames[i];
      let pos = frame.position;
      let img = spriteSheet.get(pos.x, pos.y, pos.w, pos.h);

      if (frame.name.startsWith("idle-")) {
        battlePlayerIdle.push(img);
      } else if (frame.name.startsWith("run-")) {
        battlePlayerRun.push(img);
      } else if (frame.name.startsWith("jump-")) {
        battlePlayerJump.push(img);
      } else if (frame.name.startsWith("attack-")) {
        battlePlayerAttack.push(img);
      } else if (frame.name.startsWith("death-")) {
        battlePlayerDeath.push(img);
      }
  }

  let bossFrames = bossData.frames;
    for (let i = 0; i < bossFrames.length; i++) {
    let frame = bossFrames[i];
    let pos = frame.position;
    let img = bossSprite.get(pos.x, pos.y, pos.w, pos.h);

    if (frame.name.startsWith("run-")) {
      bossRun.push(img);
    } else if (frame.name.startsWith("attack1-")) {
      bossAttack1.push(img);
    } else if (frame.name.startsWith("attack2-")) {
      bossAttack2.push(img);
    } else if (frame.name.startsWith("death-")) {
      bossDeath.push(img);
    }
  }
  
}

/**
 * Display method
 */
function draw() {
  background(0);
  sceneManager.update();
  sceneManager.display();
}

/**
 * Key pressed function
 */
function keyPressed() {
  sceneManager.handleKeyPressed(key);
}

/**
 * Mouse pressed function
 */
function mousePressed() {
  sceneManager.handleMousePressed();
}
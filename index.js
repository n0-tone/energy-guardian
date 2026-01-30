// @author: no-tone
//--------------------------------------------------------------------------------------------

// Preload Scene: Preload all assets
class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Progress bar setup
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);

    const { x, y } = calculatePosition(240, 270);
    const barWidth = game.config.width * 0.4;
    const barHeight = game.config.height * 0.08;
    progressBox.fillRect(x, y, barWidth, barHeight);

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    // Loading percentage text
    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: `${calculateFontSize(18)}px PixelOperator8-Bold`,
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    // Name of the asset currently being loaded
    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: `${calculateFontSize(18)}px PixelOperator8-Bold`,
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // Additional text
    let additionalText = this.make.text({
      x: width / 2,
      y: height / 2 + 280,
      text: "The first time may take a bit longer...",
      style: {
        font: `${calculateFontSize(18)}px PixelOperator8-Bold`,
        fill: "#ffffff",
      },
    });
    additionalText.setOrigin(0.5, 0.5);

    // Text and bar updates
    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        x + 10,
        y + 10,
        (barWidth - 20) * value,
        barHeight - 20,
      );
    });

    // File name text
    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });

    // Hide when complete
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    // Load backgrounds (outside the game)
    this.load.image("background", "assets/world/map.png");
    this.load.image("bgInit", "assets/world/bg.jpg");

    // Load level backgrounds
    this.load.image("level1", "assets/tiles/desert_tile.png");
    this.load.image("level2", "assets/tiles/snow_tile.png");
    this.load.image("level3", "assets/tiles/grass_tile.png");
    this.load.image("level4", "assets/tiles/undead_tile.png");

    // Load character spritesheets
    this.load.spritesheet("player1", "assets/char/1.png", {
      frameWidth: 136,
      frameHeight: 170,
    });
    this.load.spritesheet("player2", "assets/char/2.png", {
      frameWidth: 136,
      frameHeight: 170,
    });

    // Load attack and obstacle spritesheets
    this.load.spritesheet("fireball", "assets/char/fireball.png", {
      frameWidth: 121,
      frameHeight: 125,
    });
    this.load.spritesheet("smoke", "assets/etc/smoke.png", {
      frameWidth: 426,
      frameHeight: 497,
    });
    this.load.image("obstacle", "assets/etc/smoke.png");

    // Load player/game audio
    this.load.audio("collect", "assets/sounds/coin.wav");
    this.load.audio("complete", "assets/sounds/power_up.wav");
    this.load.audio("shootSound", "assets/sounds/hurt.wav");
    this.load.audio("dead", "assets/sounds/explosion.wav");

    // Load background music
    this.load.audio("level1-song", "assets/music/level1.mp3");
    this.load.audio("level2-song", "assets/music/level2.mp3");
    this.load.audio("level3-song", "assets/music/level3.mp3");
    this.load.audio("level4-song", "assets/music/level4.mp3");

    // Load pause menu sounds
    this.load.audio("closePauseMenu", "assets/sounds/close_pausemenu.mp3");
    this.load.audio("openPauseMenu", "assets/sounds/open_pausemenu.mp3");

    // Load solar panel sounds
    this.load.audio("solar_appear", "assets/sounds/solar_appear.mp3");
    this.load.audio("solar_disappear", "assets/sounds/solar_disappear.mp3");
    this.load.audio("solar_collect", "assets/sounds/solar_collect.mp3");

    this.load.image("solar", "assets/etc/solarPanel.png");

    this.load.audio("ambient", "assets/music/bgMusic.mp3");

    // Load the font used in the game
    this.loadFont(
      "PixelOperator8-Bold",
      "assets/fonts/PixelOperator8-Bold.ttf",
    );

    // Load joystick plugin
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true,
    );
  }

  // Create the next scene
  create() {
    this.createAnimations();
    this.scene.start("StartScene");
  }

  // Create animations
  createAnimations() {
    const animations = [
      {
        // Walk
        key: "walk",
        spritesheet: "player1",
        frames: [16, 17, 18, 19, 20, 21, 22, 23],
        repeat: -1,
        frameRate: 10,
      },
      {
        // Idle
        key: "idle",
        spritesheet: "player1",
        frames: [0, 1, 2, 3, 4, 5, 6],
        repeat: -1,
        frameRate: 10,
      },
      {
        // Attack
        key: "attack",
        spritesheet: "player2",
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
        repeat: 0,
        frameRate: 64,
      },
      {
        // Death
        key: "dead",
        spritesheet: "player2",
        frames: [32, 33, 34, 35, 36, 37],
        repeat: 0,
        frameRate: 7,
      },
      {
        // Fireball (when attacking)
        key: "fireball",
        spritesheet: "fireball",
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        repeat: 0,
        frameRate: 10,
      },
      {
        // Obstacle
        key: "smoke",
        spritesheet: "smoke",
        frames: [0, 1, 2, 3, 4, 5],
        repeat: -1,
        frameRate: 10,
      },
    ];

    // Animation setup
    animations.forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(anim.spritesheet, {
          frames: anim.frames,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    });
  }

  // Load and register the game font
  loadFont(name, url) {
    const newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      .then(function (loadedFont) {
        document.fonts.add(loadedFont);
      })
      .catch(function (error) {
        console.error("Error loading font", error);
      });
  }
}

// Scene that runs in the background (except for GameScene)
class BaseScene extends Phaser.Scene {
  // Place the background
  createBackground(imageName = "bgInit", darkTint = false) {
    const bg = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      imageName,
    );
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    if (darkTint) {
      bg.setTint(0x222222);
    }
  }

  // Apply font styles
  applyFontStyle(size = "24px", color = "#ffffff") {
    return {
      fontSize: calculateFontSize(parseInt(size)),
      fill: color,
      fontFamily: "PixelOperator8-Bold",
    };
  }

  // Create a back button to return to a given scene
  createBackButton(scene) {
    const { x, y } = calculatePosition(50, 550);
    const backButton = this.add
      .text(x, y, "Back", this.applyFontStyle("20px"))
      .setInteractive()
      .on("pointerdown", () => this.scene.start(scene));
    return backButton;
  }

  // Play ambient background music on the appropriate screens
  playAmbientMusic() {
    if (!this.sound.get("ambient")) {
      const ambientVolume =
        parseFloat(localStorage.getItem("ambientVolume")) || 0.5;
      this.ambientMusic = this.sound.add("ambient", {
        loop: true,
        volume: ambientVolume,
      });
      this.ambientMusic.play();
    } else if (!this.sound.get("ambient").isPlaying) {
      this.sound.get("ambient").play();
    }
  }
}

// First real scene of the game
class StartScene extends BaseScene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    this.createBackground("bgInit", true);

    // Main title text
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(
        centerX,
        topY,
        "Energy Guardian Adventure",
        this.applyFontStyle("30px"),
      )
      .setOrigin(0.5);
    this.add
      .text(
        centerX,
        topY + 35,
        "--------------------------------",
        this.applyFontStyle("30px"),
      )
      .setOrigin(0.5);

    const { x: bottomRightX, y: bottomRightY } = calculatePosition(710, 585);
    this.add
      .text(
        bottomRightX,
        bottomRightY,
        "no-tone - 2026",
        this.applyFontStyle("15px"),
      )
      .setOrigin(0.5);

    // Menu buttons
    const buttons = [
      { text: "Play", scene: "LevelSelectScene" },
      { text: "Objective", scene: "ObjectiveScene" },
      { text: "Controls", scene: "ControlsScene" },
      { text: "Difficulty", scene: "DifficultySelectScene" },
      { text: "Options", scene: "OptionsSelectScene" },
    ];

    buttons.forEach((button, index) => {
      const { x, y } = calculatePosition(400, 210 + index * 50);
      this.add
        .text(x, y, button.text, this.applyFontStyle())
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.scene.start(button.scene));
    });

    // Reset levels if the user clicks the button
    const { x: bottomLeftX, y: bottomLeftY } = calculatePosition(110, 585);
    const clearDataButton = this.add
      .text(
        bottomLeftX,
        bottomLeftY,
        "Reset Levels",
        this.applyFontStyle("15px"),
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        localStorage.removeItem("levels");
        clearDataButton.setText("Levels Reset");
        console.log("Levels data cleared");
      });

    this.playAmbientMusic();
  }
}

// Objective screen
class ObjectiveScene extends BaseScene {
  constructor() {
    super("ObjectiveScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Objective text
    this.createBackground("bgInit", true);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Objective", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    const objectives = [
      "Collect renewable energy",
      "to restore the environment.",
      "Avoid obstacles",
      "so you don't lose energy.",
      "Reach the energy goal",
      "before time runs out!",
    ];

    objectives.forEach((objective, index) => {
      const { x, y } = calculatePosition(400, 200 + index * 40);
      this.add
        .text(x, y, objective, this.applyFontStyle("20px"))
        .setOrigin(0.5);
    });

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }
}

// Controls screen
class ControlosScene extends BaseScene {
  constructor() {
    super("ControlsScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Controls text
    this.createBackground("bgInit", true);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Controls", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    const controls = [
      { text: "Movement:", x: 400, y: 200 },
      { text: "← - Left", x: 200, y: 260 },
      { text: "→ - Right", x: 600, y: 260 },
      { text: "↑ - Up", x: 200, y: 330 },
      { text: "↓ - Down", x: 600, y: 330 },
      { text: "Actions:", x: 400, y: 380 },
      { text: "Click - Attack", x: 400, y: 440 },
    ];

    controls.forEach((control) => {
      const { x, y } = calculatePosition(control.x, control.y);
      this.add
        .text(x, y, control.text, this.applyFontStyle("21px"))
        .setOrigin(0.5);
    });

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }
}

// Difficulty selection screen
class DifficultySelectScene extends BaseScene {
  constructor() {
    super("DifficultySelectScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Screen title
    this.createBackground("bgInit", true);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Select Difficulty", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    // Difficulty options
    const difficulties = ["Easy", "Medium", "Hard"];
    this.difficulties = difficulties.map((level, index) => {
      const { x, y } = calculatePosition(400, 250 + index * 50);
      return {
        name: level,
        button: this.add
          .text(x, y, level, this.applyFontStyle())
          .setOrigin(0.5)
          .setInteractive(),
      };
    });

    this.difficulties.forEach((difficulty) => {
      difficulty.button.on("pointerdown", () =>
        this.selectDifficulty(difficulty.name),
      );
    });

    // Restore previous selection, defaulting to Medium.
    // Also accept older Portuguese saves for compatibility.
    this.selectedDifficulty = normalizeDifficulty(
      localStorage.getItem("selectedDifficulty"),
    );
    this.updateDifficultyVisuals();

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }

  // Select the desired difficulty
  selectDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    localStorage.setItem("selectedDifficulty", difficulty);
    this.updateDifficultyVisuals();
  }

  // Highlight selected difficulty
  updateDifficultyVisuals() {
    this.difficulties.forEach((difficulty) => {
      const color =
        difficulty.name === this.selectedDifficulty ? "#ff0000" : "#ffffff";
      difficulty.button.setStyle(this.applyFontStyle("24px", color));
    });
  }
}

// Options screen
class OptionsSelectScene extends BaseScene {
  constructor() {
    super("OptionsSelectScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Options title
    this.createBackground("bgInit", true);
    this.add
      .text(400, 100, "Options", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    // Slider: music volume (level music only)
    this.add
      .text(400, 190, "Music", this.applyFontStyle("24px"))
      .setOrigin(0.5);
    this.musicVolume = parseFloat(localStorage.getItem("musicVolume")) || 0.5;
    this.musicSlider = this.createSlider(
      400,
      240,
      this.musicVolume,
      (value) => {
        this.musicVolume = value;
        localStorage.setItem("musicVolume", value);
        // Update only level music volumes
        ["level1-song", "level2-song", "level3-song", "level4-song"].forEach(
          (key) => {
            const music = this.sound.get(key);
            if (music) {
              music.setVolume(value);
            }
          },
        );
      },
    );

    // Slider: sound effects
    this.add
      .text(400, 290, "Sound Effects", this.applyFontStyle("24px"))
      .setOrigin(0.5);
    this.sfxVolume = parseFloat(localStorage.getItem("sfxVolume")) || 0.5;
    this.sfxSlider = this.createSlider(400, 340, this.sfxVolume, (value) => {
      this.sfxVolume = value;
      localStorage.setItem("sfxVolume", value);
      ["shootSound", "collect", "complete", "dead"].forEach((key) => {
        const sfx = this.sound.get(key);
        if (sfx) {
          sfx.setVolume(value);
        }
      });
    });

    // Slider: ambient music only
    this.add
      .text(400, 390, "Ambient", this.applyFontStyle("24px"))
      .setOrigin(0.5);
    this.ambientVolume =
      parseFloat(localStorage.getItem("ambientVolume")) || 0.5;
    this.ambientSlider = this.createSlider(
      400,
      440,
      this.ambientVolume,
      (value) => {
        this.ambientVolume = value;
        localStorage.setItem("ambientVolume", value);
        const ambientMusic = this.sound.get("ambient");
        if (ambientMusic) {
          ambientMusic.setVolume(value);
        }
      },
    );

    // Toggle for enabling/disabling the joystick
    const joystickState = localStorage.getItem("joystick") === "true";
    const joystickText = joystickState ? "Joystick [X]" : "Joystick [ ]";

    this.joystick = this.add
      .text(400, 490, joystickText, this.applyFontStyle("24px"))
      .setOrigin(0.5)
      .setInteractive();

    this.joystick.on("pointerdown", () => {
      if (this.joystick.text === "Joystick [ ]") {
        this.joystick.setText("Joystick [X]");
        localStorage.setItem("joystick", "true");
      } else {
        this.joystick.setText("Joystick [ ]");
        localStorage.setItem("joystick", "false");
      }
    });

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }

  // Slider creation helper to avoid repetition
  createSlider(x, y, initialValue, onUpdate) {
    const width = 200;
    const height = 20;
    const bar = this.add
      .rectangle(x, y, width, height, 0x888888)
      .setOrigin(0.5);
    const slider = this.add
      .rectangle(x + width * initialValue - width / 2, y, 20, 30, 0xffffff)
      .setInteractive();

    this.input.setDraggable(slider);

    slider.on("drag", (pointer, dragX) => {
      const newX = Phaser.Math.Clamp(dragX, x - width / 2, x + width / 2);
      slider.x = newX;
      const value = (newX - (x - width / 2)) / width;
      onUpdate(value);
    });

    return { bar, slider };
  }
}

// Level selection screen
class LevelSelectScene extends BaseScene {
  constructor() {
    super("LevelSelectScene");
  }

  create() {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Background + tint overlay
    this.createBackground("background");
    const darkTint = this.add
      .rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.6)
      .setOrigin(0);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Select Level", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    // Load levels from localStorage (or defaults). Normalize older PT saves.
    this.levels = normalizeLevels(JSON.parse(localStorage.getItem("levels")));

    // Different colors depending on whether the level is locked
    this.levels.forEach((level, index) => {
      const color = level.unlocked ? "#ffffff" : "#ff0000";
      const { x, y } = calculatePosition(level.x, level.y);
      const levelButton = this.add
        .text(x, y, level.name, this.applyFontStyle("24px", color))
        .setOrigin(0.5);

      // Only clickable if unlocked
      if (level.unlocked) {
        levelButton.setInteractive();
        levelButton.on("pointerdown", () =>
          this.startLevel(index + 1, level.energyGoal),
        );
      }
    });

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }

  // Start the selected level
  startLevel(level, energyGoal) {
    const difficulty = normalizeDifficulty(
      this.scene.get("DifficultySelectScene").selectedDifficulty,
    );
    this.sound.stopAll();
    this.scene.start("GameScene", { level, difficulty, energyGoal });
  }
}

// The game itself
class GameScene extends BaseScene {
  constructor() {
    super("GameScene");
    // Animation origins
    this.animationOrigins = {
      walk: { x: 0.6, y: 0.4 },
      idle: { x: 0.5, y: 0.5 },
      attack: { x: 0.5, y: 0.5 },
      dead: { x: 0.5, y: 0.2 },
    };
    this.lastFireballTime = 0;
    this.fireballDelay = 500; // 0.5 seconds
  }

  // Game creation
  create(data) {
    this.input.keyboard.enabled = true;
    this.input.mouse.enabled = true;

    // Variables
    const { level, difficulty, energyGoal } = data;
    this.currentLevel = level;

    // Background setup
    const bg = this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      `level${level}`,
    );

    // Background scaling per level
    if (level === 4) {
      bg.setScale(2);
    } else {
      const scaleX = this.cameras.main.width / bg.width;
      const scaleY = this.cameras.main.height / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale);
    }

    bg.setScrollFactor(0);

    // Player setup
    const { x: playerX, y: playerY } = calculatePosition(400, 300);
    this.player = this.physics.add.sprite(playerX, playerY, "player1");
    this.player.setCollideWorldBounds(true);

    // Player hitbox sizing
    const playerWidth = 40 * (game.config.width / 800);
    const playerHeight = 120 * (game.config.height / 600);
    this.player.body.setSize(playerWidth, playerHeight);
    this.player.body.setOffset(
      (this.player.width - playerWidth) / 2,
      (this.player.height - playerHeight) / 2,
    );

    // Initial player state
    this.playerState = "idle";
    this.player.anims.play("idle", true);
    this.updatePlayerOrigin();

    // Game state
    this.score = 0;
    this.energy = 0;
    this.energyGoal = energyGoal;
    this.timeLimit = 60;
    this.lives = 3;
    this.isGameOver = false;
    this.isPaused = false;
    this.isMoving = false;

    // Cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown", this.shootFireball, this);

    // Obstacles group
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.handleCollision,
      null,
      this,
    );

    // Solar panels group
    this.solarPanels = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Overlap: solar panels
    this.physics.add.overlap(
      this.player,
      this.solarPanels,
      this.collectSolarPanel,
      null,
      this,
    );

    // Remaining setup
    this.createUI(level);
    this.initGame(normalizeDifficulty(difficulty));
    this.setupPauseMenu();
    this.setupAudio(level);
    this.joyStickSetup();

    // Start solar panel spawn
    this.time.addEvent({
      delay: 8500, // 8.5 seconds
      callback: this.spawnSolarPanel,
      callbackScope: this,
      loop: true,
    });
  }

  // Update player origin (helps sprite alignment)
  updatePlayerOrigin() {
    const origin = this.animationOrigins[this.playerState];
    if (origin) {
      this.player.setOrigin(origin.x, origin.y);
    }
  }

  // Joystick setup
  joyStickSetup() {
    const joystickState = localStorage.getItem("joystick") === "true";

    // Create joystick if enabled
    if (joystickState) {
      const { x: joystickX, y: joystickY } = calculatePosition(100, 500);
      const joystickRadius =
        Math.min(game.config.width, game.config.height) * 0.08;
      this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
        x: joystickX,
        y: joystickY,
        radius: joystickRadius,
        base: this.add.circle(0, 0, joystickRadius, 0x888888),
        thumb: this.add.circle(0, 0, joystickRadius * 0.6, 0xcccccc),
      });

      // Create joystick cursor keys
      this.joyStickCursorKeys = this.joyStick.createCursorKeys();
    }
  }

  // Audio setup
  setupAudio(level) {
    const musicVolume = parseFloat(localStorage.getItem("musicVolume")) || 0.5;

    // Guard if level is undefined
    if (level !== undefined) {
      this.levelMusic = this.sound.add(`level${level}-song`, {
        loop: true,
        volume: musicVolume,
      });
      this.levelMusic.play();
    } else {
      console.warn("Level is undefined.");
    }

    // Volume based on user options
    const sfxVolume = parseFloat(localStorage.getItem("sfxVolume")) || 0.5;
    this.shootSound = this.sound.add("shootSound", { volume: sfxVolume });
    this.deadSound = this.sound.add("dead", { volume: sfxVolume });

    // Solar panel sounds
    this.solarAppearSound = this.sound.add("solar_appear", {
      volume: sfxVolume,
    });
    this.solarDisappearSound = this.sound.add("solar_disappear", {
      volume: sfxVolume,
    });
    this.solarCollectSound = this.sound.add("solar_collect", {
      volume: sfxVolume,
    });

    // Pause menu sounds
    this.openPauseMenuSound = this.sound.add("openPauseMenu", {
      volume: sfxVolume,
    });
    this.closePauseMenuSound = this.sound.add("closePauseMenu", {
      volume: sfxVolume,
    });
  }

  // Pause menu
  setupPauseMenu() {
    this.pauseMenu = this.add.container(
      game.config.width / 2,
      game.config.height / 2,
    );
    this.pauseMenu.add(
      this.add.rectangle(
        0,
        0,
        game.config.width,
        game.config.height,
        0x000000,
        1,
      ),
    );
    this.pauseMenu.add(
      this.add
        .text(
          0,
          -game.config.height * 0.12,
          "PAUSED",
          this.applyFontStyle("32px"),
        )
        .setOrigin(0.5),
    );
    this.pauseMenu.add(
      this.add
        .text(0, 0, "ESC - Resume", this.applyFontStyle("24px"))
        .setOrigin(0.5),
    );
    this.pauseMenu.add(
      this.add
        .text(
          0,
          game.config.height * 0.1,
          "S - Exit",
          this.applyFontStyle("24px"),
        )
        .setOrigin(0.5),
    );
    this.pauseMenu.setDepth(1000);
    this.pauseMenu.setVisible(false);

    // ESC resumes, S exits to level select
    this.input.keyboard.on("keydown-ESC", this.togglePause, this);
    this.input.keyboard.on("keydown-S", this.quitToLevelSelect, this);
  }

  // Pause/resume game systems and audio
  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseMenu.setVisible(true);
      this.physics.pause();
      this.levelMusic.pause();
      this.smokeEvent.paused = true;
      this.timerEvent.paused = true;
      this.openPauseMenuSound.play();
    } else {
      this.pauseMenu.setVisible(false);
      this.physics.resume();
      this.levelMusic.resume();
      this.smokeEvent.paused = false;
      this.timerEvent.paused = false;
      this.closePauseMenuSound.play();
    }
  }

  // When the user presses S
  quitToLevelSelect() {
    if (this.isPaused) {
      this.levelMusic.stop();
      this.scene.start("LevelSelectScene");
    }
  }

  // In-game UI
  createUI(level) {
    let fillColor = "#ffffff";

    if (level === 2) {
      fillColor = "#000000";
    }

    const fontStyle = this.applyFontStyle("24px", fillColor);
    const { x: scoreX, y: scoreY } = calculatePosition(16, 16);
    this.scoreText = this.add.text(scoreX, scoreY, "Score: 0", fontStyle);
    const { x: livesX, y: livesY } = calculatePosition(16, 50);
    this.livesText = this.add.text(livesX, livesY, "Lives: 3", fontStyle);
    const { x: timeX, y: timeY } = calculatePosition(580, 16);
    this.timeText = this.add.text(timeX, timeY, "Time: 60", fontStyle);
    const { x: pauseX, y: pauseY } = calculatePosition(16, 574);
    this.add.text(
      pauseX,
      pauseY,
      "ESC to Pause",
      this.applyFontStyle("15px", fillColor),
    );

    // Player progress bar
    this.progressBar = this.add.graphics();
    this.progressBar.fillStyle(0x00ff00, 1);

    this.updateProgressBar();
  }

  // Initialize game values based on difficulty
  initGame(difficulty) {
    switch (difficulty) {
      case "Easy":
        this.obstacleSpeed = game.config.width * 0.25;
        this.obstacleSpawnRate = 1000;
        break;
      case "Hard":
        this.obstacleSpeed = game.config.width * 0.4375;
        this.obstacleSpawnRate = 300;
        break;
      default: // Medium
        this.obstacleSpeed = game.config.width * 0.3125;
        this.obstacleSpawnRate = 700;
    }

    // Game timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Obstacle spawns
    this.smokeEvent = this.time.addEvent({
      delay: this.obstacleSpawnRate,
      callback: this.spawnSmoke,
      callbackScope: this,
      loop: true,
    });
  }

  // Spawn obstacles
  spawnSmoke() {
    // Do nothing if paused
    if (this.isPaused) return;

    // Create obstacle
    const smoke = this.obstacles.create(
      game.config.width,
      Phaser.Math.Between(game.config.height * 0.17, game.config.height * 0.83),
      "smoke",
    );
    smoke.setScale(0.2 * (game.config.width / 800));

    // Hitbox
    const smokeWidth = 60 * (game.config.width / 800);
    const smokeHeight = 70 * (game.config.height / 600);
    smoke.body.setSize(smokeWidth, smokeHeight);
    smoke.body.setOffset(
      (smoke.width * smoke.scale - smokeWidth) / 2,
      (smoke.height * smoke.scale - smokeHeight) / 2 + 5,
    );

    // Speed depends on game state and difficulty
    smoke.setVelocityX(-this.obstacleSpeed);
    smoke.setImmovable(true);
    smoke.play("smoke");
  }

  // Spawn solar panels
  spawnSolarPanel() {
    if (this.isPaused) return;

    const x = Phaser.Math.Between(
      game.config.width * 0.125,
      game.config.width * 0.875,
    );
    const y = Phaser.Math.Between(
      game.config.height * 0.167,
      game.config.height * 0.833,
    );
    const solarPanel = this.solarPanels.create(x, y, "solar");
    solarPanel.setScale(1.2 * (game.config.width / 800));

    this.solarAppearSound.play();

    // Remove after 4 seconds if not collected
    this.time.delayedCall(4000, () => {
      if (solarPanel.active) {
        solarPanel.destroy();
        this.solarDisappearSound.play();
      }
    });
  }

  // Collect solar panels
  collectSolarPanel(player, solarPanel) {
    solarPanel.destroy();
    this.solarCollectSound.play();
    this.score += 15;
    this.energy += 15;
    this.scoreText.setText(`Score: ${this.score}`);
    this.updateProgressBar();
    if (this.energy >= this.energyGoal) this.completeLevel();
  }

  // Fireball shot after the player attacks
  shootFireball(pointer) {
    // Guard conditions
    if (this.isPaused || this.isGameOver || this.isMoving) return;

    const currentTime = this.time.now;
    if (currentTime - this.lastFireballTime < this.fireballDelay) {
      return; // Don't shoot if the delay hasn't passed
    }

    // Don't shoot while walking
    if (this.playerState != "walk") {
      // Aim sprite based on mouse and player position
      const angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        pointer.x,
        pointer.y,
      );

      const fireball = this.physics.add
        .sprite(this.player.x, this.player.y, "fireball")
        .setScale(0.5 * (game.config.width / 800));
      fireball.setRotation(angle);
      fireball.play("fireball");
      this.physics.moveTo(
        fireball,
        pointer.x,
        pointer.y,
        game.config.width * 0.75,
      );

      // If the fireball hits an obstacle, destroy both
      this.physics.add.collider(fireball, this.obstacles, (f, obstacle) => {
        this.sound.play("collect");
        obstacle.destroy();
        f.destroy();
        this.updateScore();
      });

      this.player.anims.play("attack", true);
      this.updatePlayerOrigin();

      // Attack animation ends and returns to idle
      this.player.once("animationcomplete", (animation) => {
        if (animation.key === "attack") {
          this.player.anims.play("idle", true);
          this.updatePlayerOrigin();
        }
      });

      this.shootSound.play({ volume: this.sound.volume });

      this.lastFireballTime = currentTime;
    }
  }

  // Update score when an obstacle is destroyed
  updateScore() {
    this.score += 10;
    this.energy += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    this.updateProgressBar();
    if (this.energy >= this.energyGoal) this.completeLevel();
  }

  // Update progress bar
  updateProgressBar() {
    const progress = (this.energy / this.energyGoal) * game.config.width * 0.75;
    this.progressBar.clear();
    this.progressBar.fillStyle(0x00ff00, 1);
    const { x, y } = calculatePosition(100, 550);
    this.progressBar.fillRect(x, y, progress, game.config.height * 0.033);
  }

  // Update timer (if not paused)
  updateTimer() {
    if (this.isPaused) return;
    if (this.timeLimit > 0) {
      this.timeLimit--;
      this.timeText.setText(`Time: ${this.timeLimit}`);
      if (this.timeLimit <= 0) this.gameOver();
    }
  }

  // Collision between player and obstacle
  handleCollision(player, obstacle) {
    if (!obstacle.active || this.isGameOver) return;

    // -1 life
    obstacle.destroy();
    this.lives--;
    this.livesText.setText(`Lives: ${this.lives}`);

    // If lives remain
    if (this.lives > 0) {
      this.deadSound.play();
      this.player.setTint(0xff0000);
      this.time.delayedCall(200, () => {
        this.player.clearTint();
      });
    }

    // If no lives remain (game over)
    if (this.lives <= 0) {
      this.deadSound.play();
      this.gameOver();
    }
  }

  // Complete the level when the progress bar reaches the goal
  completeLevel() {
    this.sound.play("complete");
    this.player.play("idle");
    this.timerEvent.remove();
    this.smokeEvent.remove();
    this.levelMusic.stop();
    this.scene.start("LevelCompleteScene", {
      score: this.score,
      level: this.scene.settings.data.level,
    });
  }

  // Game over when no lives remain
  gameOver() {
    this.isGameOver = true;
    this.timerEvent.remove();
    this.smokeEvent.remove();
    this.physics.pause();
    this.levelMusic.stop();

    // Disable player input
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = false;

    this.playerState = "dead";
    this.player.anims.play("dead");
    this.updatePlayerOrigin();

    // Play animation then change scene
    this.player.on("animationcomplete", (animation) => {
      if (animation.key === "dead") {
        this.time.delayedCall(400, () => {
          this.scene.start("GameOverScene", {
            score: this.score,
            level: this.currentLevel,
            difficulty: this.scene.settings.data.difficulty,
            energyGoal: this.scene.settings.data.energyGoal,
          });
        });
      }
    });
  }

  // Player movement update
  update() {
    if (this.isPaused || this.isGameOver) {
      this.player.setVelocity(0);
      return;
    }

    const speed = game.config.width * 0.2;
    let newState = "idle";
    this.isMoving = false;

    // Keyboard movement
    // Left
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      newState = "walk";
      this.isMoving = true;
      // Right
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      newState = "walk";
      this.isMoving = true;
    } else {
      this.player.setVelocityX(0);
    }

    // Up
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      newState = "walk";
      this.isMoving = true;
      // Down
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      newState = "walk";
      this.isMoving = true;
    } else {
      this.player.setVelocityY(0);
    }

    // Joystick movement
    if (this.joyStickCursorKeys) {
      // Left
      if (this.joyStickCursorKeys.left.isDown) {
        this.player.setVelocityX(-speed);
        this.player.flipX = true;
        newState = "walk";
        this.isMoving = true;
        // Right
      } else if (this.joyStickCursorKeys.right.isDown) {
        this.player.setVelocityX(speed);
        this.player.flipX = false;
        newState = "walk";
        this.isMoving = true;
      }

      // Up
      if (this.joyStickCursorKeys.up.isDown) {
        this.player.setVelocityY(-speed);
        newState = "walk";
        this.isMoving = true;
        // Down
      } else if (this.joyStickCursorKeys.down.isDown) {
        this.player.setVelocityY(speed);
        newState = "walk";
        this.isMoving = true;
      }
    }

    // Update player animation state
    if (
      newState !== this.playerState ||
      (newState === "idle" && !this.player.anims.isPlaying)
    ) {
      this.playerState = newState;
      this.player.anims.play(this.playerState, true);
      this.updatePlayerOrigin();

      // Add listener for animation completion
      this.player.once("animationcomplete", (animation) => {
        if (animation.key === "walk") {
          this.playerState = "idle";
          this.player.anims.play("idle", true);
          this.updatePlayerOrigin();
        }
      });
    }
  }
}

// Level complete screen
class LevelCompleteScene extends BaseScene {
  constructor() {
    super("LevelCompleteScene");
  }

  create(data) {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Screen text
    this.createBackground("bgInit", true);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Level Complete!", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    const { x: scoreX, y: scoreY } = calculatePosition(400, 200);
    this.add
      .text(scoreX, scoreY, `Score: ${data.score}`, this.applyFontStyle("24px"))
      .setOrigin(0.5);

    // Levels (normalize older PT saves)
    let levels = normalizeLevels(JSON.parse(localStorage.getItem("levels")));

    // Unlock next level
    if (data.level < levels.length) {
      levels[data.level].unlocked = true;
      localStorage.setItem("levels", JSON.stringify(levels));
    }

    // Level 4 doesn't unlock anything else
    if (data.level < 4) {
      const { x: nextLevelX, y: nextLevelY } = calculatePosition(400, 300);
      const nextLevelButton = this.add
        .text(nextLevelX, nextLevelY, "Next Level", this.applyFontStyle())
        .setOrigin(0.5)
        .setInteractive();
      nextLevelButton.on("pointerdown", () => {
        this.sound.stopAll();
        this.scene.start("GameScene", {
          level: data.level + 1,
          difficulty: normalizeDifficulty(
            this.scene.get("DifficultySelectScene").selectedDifficulty,
          ),
          energyGoal: (data.level + 1) * 50,
        });
      });
    }

    // Custom end-of-game text
    if (data.level === 4) {
      const { x: congratsX, y: congratsY } = calculatePosition(400, 300);
      this.add
        .text(
          congratsX,
          congratsY,
          "Congratulations! You finished the game!",
          this.applyFontStyle("24px"),
        )
        .setOrigin(0.5);
    }

    // Button to return to level selection
    const { x: backX, y: backY } = calculatePosition(400, 350);
    const backtoLevelsButton = this.add
      .text(backX, backY, "Level Select", this.applyFontStyle())
      .setOrigin(0.5)
      .setInteractive();
    backtoLevelsButton.on("pointerdown", () =>
      this.scene.start("LevelSelectScene"),
    );

    this.createBackButton("StartScene");

    this.playAmbientMusic();
  }
}

class GameOverScene extends BaseScene {
  constructor() {
    super("GameOverScene");
  }

  create(data) {
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = true;

    // Screen text
    this.createBackground("bgInit", true);
    const { x: centerX, y: topY } = calculatePosition(400, 100);
    this.add
      .text(centerX, topY, "Game Over!", this.applyFontStyle("32px"))
      .setOrigin(0.5);

    const { x: scoreX, y: scoreY } = calculatePosition(400, 200);
    this.add
      .text(scoreX, scoreY, `Score: ${data.score}`, this.applyFontStyle("24px"))
      .setOrigin(0.5);

    // Restart the level that was just played
    const { x: restartX, y: restartY } = calculatePosition(400, 300);
    const restartButton = this.add
      .text(restartX, restartY, "Restart", this.applyFontStyle())
      .setOrigin(0.5)
      .setInteractive();
    restartButton.on("pointerdown", () => {
      this.sound.stopAll();
      this.scene.start("GameScene", {
        level: data.level,
        difficulty: data.difficulty,
        energyGoal: data.energyGoal,
      });
    });

    // Back to level selection
    const { x: backX, y: backY } = calculatePosition(400, 350);
    const backtoLevelsButton = this.add
      .text(backX, backY, "Level Select", this.applyFontStyle())
      .setOrigin(0.5)
      .setInteractive();
    backtoLevelsButton.on("pointerdown", () =>
      this.scene.start("LevelSelectScene"),
    );

    this.createBackButton("StartScene");
    this.playAmbientMusic();
  }
}

// Game config: levels, window sizing, physics, etc.
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#1d1d1d",
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-container",
    width: 800,
    height: 600,
    min: {
      width: 300,
      height: 225,
    },
    max: {
      width: 800,
      height: 600,
    },
    autoRound: true,
  },
  scene: [
    PreloadScene,
    StartScene,
    ObjectiveScene,
    ControlosScene,
    DifficultySelectScene,
    OptionsSelectScene,
    LevelSelectScene,
    GameScene,
    LevelCompleteScene,
    GameOverScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  plugins: { global: [{}] },
};

const game = new Phaser.Game(config);

// Helper: responsive font sizing
function calculateFontSize(baseSize) {
  // Obter o tamanho real do canvas
  const canvas = game.canvas;
  const scaleFactor = Math.min(canvas.width / 800, canvas.height / 600);
  return Math.floor(baseSize * scaleFactor);
}

// Helper: responsive positions
function calculatePosition(x, y) {
  const canvas = game.canvas;
  const scaleX = canvas.width / 800;
  const scaleY = canvas.height / 600;
  return {
    x: x * scaleX,
    y: y * scaleY,
  };
}

// Update game size
function updateGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = 800 / 600;

  let newWidth, newHeight;

  if (width / height > aspectRatio) {
    newHeight = height;
    newWidth = height * aspectRatio;
  } else {
    newWidth = width;
    newHeight = width / aspectRatio;
  }

  game.scale.resize(newWidth, newHeight);

  // Update positions and font sizes in all active scenes
  game.scene.scenes.forEach((scene) => {
    if (scene.sys.settings.active) {
      scene.children.list.forEach((child) => {
        if (child.type === "Text") {
          const originalFontSize = parseInt(child.style.fontSize);
          child.setFontSize(calculateFontSize(originalFontSize));
        }
        const { x, y } = calculatePosition(child.x, child.y);
        child.setPosition(x, y);
      });
    }
  });
}

// Orientation change listener
window.addEventListener("orientationchange", () => {
  // Small delay to ensure window dimensions have updated
  setTimeout(updateGameSize, 100);
});

// Window resize listener
window.addEventListener("resize", updateGameSize);

// Call once initially to set correct size
updateGameSize();

// Add CSS so the game container is responsive
const style = document.createElement("style");
style.textContent = `
  #game-container {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  canvas {
    max-width: 100%;
    max-height: 100vh;
    object-fit: contain;
  }
`;
document.head.appendChild(style);

// --- Compatibility helpers (older PT saves -> EN) ---
function normalizeDifficulty(value) {
  const mapped = {
    Fácil: "Easy",
    Médio: "Medium",
    Difícil: "Hard",
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
  };
  return mapped[value] || "Medium";
}

function getDefaultLevels() {
  return [
    { name: "Level 1", unlocked: true, energyGoal: 150, x: 180, y: 460 },
    { name: "Level 2", unlocked: false, energyGoal: 150, x: 385, y: 210 },
    { name: "Level 3", unlocked: false, energyGoal: 200, x: 460, y: 495 },
    { name: "Level 4", unlocked: false, energyGoal: 200, x: 650, y: 250 },
  ];
}

function normalizeLevels(levels) {
  const base =
    Array.isArray(levels) && levels.length ? levels : getDefaultLevels();

  return base.map((level, index) => {
    const fallback = getDefaultLevels()[index] || {};

    const name =
      typeof level?.name === "string"
        ? level.name
            .replace(/^Nível\s+/i, "Level ")
            .replace(/^Nivel\s+/i, "Level ")
        : fallback.name;

    return {
      name: name || fallback.name,
      unlocked:
        typeof level?.unlocked === "boolean"
          ? level.unlocked
          : fallback.unlocked,
      energyGoal:
        typeof level?.energyGoal === "number"
          ? level.energyGoal
          : fallback.energyGoal,
      x: typeof level?.x === "number" ? level.x : fallback.x,
      y: typeof level?.y === "number" ? level.y : fallback.y,
    };
  });
}

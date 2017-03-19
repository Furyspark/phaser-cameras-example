var game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: preload, create: create, update: update });

var worldStage;
var mapSpr;

var mainCamera;
var minimapCamera;

var dir = "down";
var camSpeed = 8;

var mainCameraWidth = 400;
var mainCameraHeight = 300;

var viewPortRect;

function preload() {
  game.load.image("map", "assets/map.jpg");
}

function create() {
  // Create main camera, displaying 400x300 (by default) pixels of the world, at
  // screen position {0, 0} and screen size 800x600 (full screen of the game)
  mainCamera = new Camera(game, mainCameraWidth, mainCameraHeight, 0, 0, 800, 600);
  game.world.addChild(mainCamera.view);

  // Create world stage, DON'T add it to the game's stage or world group
  worldStage = new Phaser.Group(game, null);

  // Set display target of the camera to the world stage
  mainCamera.setDisplayTarget(worldStage);

  // Create the map sprite and add it to the world stage (NOT the game's stage or
  //  world group)
  mapSpr = new Phaser.Sprite(game, 0, 0, "map");
  worldStage.addChild(mapSpr);

  // Set the main camera's bounds to the map
  mainCamera.bounds.width = mapSpr.width;
  mainCamera.bounds.height = mapSpr.height;

  // Optional: create minimap padding (black border around minimap)
  var minimapPadding = new Phaser.Graphics(game, 0, 0);
  minimapPadding.beginFill(0x000);
  minimapPadding.drawRect(0, 0, 160, 160);
  minimapPadding.endFill();
  minimapPadding.position.set(0, 440);
  game.world.addChild(minimapPadding);

  // Create minimap camera, displaying the whole map sprite in size, at screen
  // position {0, 450} and screen size 100x150 (600 - 150 = 450, so it will be
  //  displayed in the bottom-left of the screen)
  minimapCamera = new Camera(game, mapSpr.width, mapSpr.height, 0, 450, 150, 150);
  game.world.addChild(minimapCamera.view);
  minimapCamera.setDisplayTarget(worldStage);

  // Optional: add viewport rectangle to minimap
  viewPortRect = new Phaser.Graphics(game, 0, 0);
  viewPortRect.beginFill(0x000, 0);
  viewPortRect.lineStyle(16, 0x00ff00);
  viewPortRect.drawRect(0, 0, mainCamera.world.width, mainCamera.world.height);
  viewPortRect.endFill();
  minimapCamera.view.addChild(viewPortRect);
}

function update() {
  // Move the main camera around the map
  if(dir === "down") {
    mainCamera.move(0, camSpeed);
    if(mainCamera.world.y + mainCamera.world.height === mainCamera.bounds.bottom) {
      dir = "right";
    }
  } else if(dir === "right") {
    mainCamera.move(camSpeed, 0);
    if(mainCamera.world.x + mainCamera.world.width === mainCamera.bounds.right) {
      dir = "up";
    }
  } else if(dir === "up") {
    mainCamera.move(0, -camSpeed);
    if(mainCamera.world.y === mainCamera.bounds.top) {
      dir = "left";
    }
  } else if(dir === "left") {
    mainCamera.move(-camSpeed, 0);
    if(mainCamera.world.x === mainCamera.bounds.left) {
      dir = "down";
    }
  }

  // Optional: update minimap viewport rectangle
  if(viewPortRect) {
    viewPortRect.position.set(mainCamera.world.x, mainCamera.world.y);
  }

  // Important!
  // Render the cameras between game logic updates and the actual rendering of
  // the game
  mainCamera.render();
  minimapCamera.render();
}
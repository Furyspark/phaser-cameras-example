// Some things to note about cameras:
//
// Cameras have separate world and port rectangles
// World rectangles represent the area of the world (their display target) they show,
//  while Port rectangle represent the area of the screen they're displayed on


function Camera() {
  this.initialize.apply(this, arguments);
}

Camera.prototype.initialize = function(game, worldWidth, worldHeight, portX, portY, portWidth, portHeight) {
  this.game = game;
  this.world = new Phaser.Rectangle(0, 0, worldWidth, worldHeight);
  this.port = new Phaser.Rectangle(portX, portY, portWidth, portHeight);
  this.texture = new Phaser.RenderTexture(this.game, this.world.width, this.world.height);
  this.view = new Phaser.Sprite(this.game, this.port.x, this.port.y, this.texture);
  this.bounds = new Phaser.Rectangle(0, 0, -1, -1);
  this.displayTarget = null;
}

// Sets this camera's display target
// Can be any display object, but in most cases will be an instance of Phaser.Group
Camera.prototype.setDisplayTarget = function(displayTarget) {
  this.displayTarget = displayTarget;
}

Camera.prototype.render = function() {
  if(!this.displayTarget) return;
  var matrix = new Phaser.Matrix();
  matrix.translate(-this.world.x, -this.world.y);
  // Render the display target to the render texture
  this.texture.render(this.displayTarget, matrix, true);
  // Update the view sprite
  this.view.x = this.port.x;
  this.view.y = this.port.y;
  this.view.width = this.port.width;
  this.view.height = this.port.height;
}

// Is this camera unrestricted by bounds?
Camera.prototype.isUnrestricted = function() {
  return this.bounds.width < 0 || this.bounds.height < 0;
}

// Instantly center the camera to the specified point in world coordinates
Camera.prototype.centerOnPoint = function(x, y) {
  if(this.isUnrestricted()) {
    this.world.x = x - this.world.width / 2;
    this.world.y = y - this.world.height / 2;
  } else {
    this.world.x = Math.max(this.bounds.left, Math.min(this.bounds.right - this.world.width,
      x - this.world.width / 2));
    this.world.y = Math.max(this.bounds.top, Math.min(this.bounds.bottom - this.world.height,
      y - this.world.height / 2));
  }
}

// Move/translate the camera's world position
Camera.prototype.move = function(h, v) {
  this.centerOnPoint(this.world.centerX + h, this.world.centerY + v);
}
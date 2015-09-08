function Editor() {
  var world = new World();
  this.writer = new Writer(world);
  this.renderer = new Renderer(world);
  var controller = new Controller(world, this.writer);
  new Mouse(this.getCanvasElement(), controller);
  new Keyboard(controller);
}

Editor.prototype.getCanvasElement = function() {
  return this.renderer.element;
};

Editor.prototype.getTextAreaElement = function() {
  return this.writer.element;
};

Editor.prototype.run = function() {
  this.tick();
};

Editor.prototype.tick = function() {
  this.renderer.update();
  requestAnimationFrame(this.tick.bind(this));
};

function Mouse(canvas, controller) {
  this.position = new Voy.Point();
  canvas.addEventListener('click', this.click.bind(this));
  canvas.addEventListener('mousemove', this.move.bind(this));
  this.controller = controller;
  this.canvas = canvas;
}

Mouse.prototype.click = function() {
  this.controller.clicked(this.position);
};

Mouse.prototype.move = function(event) {
  this.position[0] = event.x-this.canvas.offsetLeft+document.body.scrollLeft-this.canvas.width/2;
  this.position[1] = event.y-this.canvas.offsetTop+document.body.scrollTop-this.canvas.height/2;
};

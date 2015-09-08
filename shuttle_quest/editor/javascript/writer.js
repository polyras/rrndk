function Writer(world) {
  this.world = world;
  this.element = document.createElement('textarea');
  this.element.style.width = '100%';
  this.element.style.height = '400px';
}

Writer.prototype.execute = function() {
  var data = this.world.toData();
  this.element.value = JSON.stringify(data);
};

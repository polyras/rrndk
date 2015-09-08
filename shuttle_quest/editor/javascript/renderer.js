function Renderer(world) {
  this.world = world;
  this.element = document.createElement('canvas');
  this.element.width = 800;
  this.element.height = 600;

  this.context = this.element.getContext('2d');
  this.context.translate(this.element.width/2, this.element.height/2);

  this.polygonTypeIconSize = 30;
}

Renderer.prototype.update = function() {
  this.context.fillStyle = 'black';
  this.context.fillRect(-this.element.width/2, -this.element.height/2, this.element.width, this.element.height);
  this.drawPolygons();
  this.drawPoints();
  this.drawScreen();
  this.drawPolygonTypes();
  if(this.world.goal) this.drawGoal();
  if(this.world.start) this.drawStart();
};

Renderer.prototype.drawPolygonTypes = function() {
  this.context.save();
  this.context.translate(this.element.width/2-this.polygonTypeIconSize/2-5, -this.element.height/2+this.polygonTypeIconSize/2+5);
  this.world.polygonTypes.forEach(function(polygonType) {
    this.drawPolygonType(polygonType);
    this.context.translate(-this.polygonTypeIconSize-5, 0);
  }.bind(this));
  this.context.restore();
};

Renderer.prototype.drawPolygonType = function(polygonType) {
  this.context.fillStyle = polygonType.id == this.world.selectedPolygonTypeId ? '#fff' : '#000';
  this.context.fillRect(-this.polygonTypeIconSize/2, -this.polygonTypeIconSize/2, this.polygonTypeIconSize, this.polygonTypeIconSize);

  var borderWidth = 3;
  this.context.fillStyle = polygonType.color;
  this.context.fillRect(-this.polygonTypeIconSize/2+borderWidth, -this.polygonTypeIconSize/2+borderWidth, this.polygonTypeIconSize-borderWidth*2, this.polygonTypeIconSize-borderWidth*2);
};

Renderer.prototype.drawPolygons = function() {
  this.world.polygons.forEach(function(polygon) {
    this.drawPolygon(polygon);
  }.bind(this));
}

Renderer.prototype.drawPolygon = function(polygon) {
  this.context.fillStyle = polygon.type.color;

  var editorPoints = [];
  polygon.points.forEach(function(worldPoint) {
    editorPoints.push(PointConverter.worldToEditor(worldPoint, this.world.screen));
  }.bind(this));

  this.context.beginPath();
  this.context.moveTo(editorPoints[0][0], editorPoints[0][1]);
  for(var i=1; editorPoints.length>i; i++) {
    this.context.lineTo(editorPoints[i][0], editorPoints[i][1]);
  }
  this.context.lineTo(editorPoints[0][0], editorPoints[0][1]);
  this.context.closePath();
  this.context.fill();
};

Renderer.prototype.drawPoints = function() {
  this.world.points.forEach(function(point) {
    this.drawPoint(point);
  }.bind(this));
};

Renderer.prototype.drawPoint = function(point) {
  var editorPoint = PointConverter.worldToEditor(point, this.world.screen);
  var selected = this.world.isPointSelected(point);

  this.context.fillStyle = selected ? 'lightblue' : 'blue';
  this.context.beginPath();
  this.context.arc(editorPoint[0], editorPoint[1], 10, 0, Math.PI*2, true);
  this.context.closePath();
  this.context.fill();
};

Renderer.prototype.drawGoal = function() {
  var editorPoint = PointConverter.worldToEditor(this.world.goal, this.world.screen);

  this.context.fillStyle = 'yellow';
  this.context.beginPath();
  this.context.arc(editorPoint[0], editorPoint[1], 10, 0, Math.PI*2, true);
  this.context.closePath();
  this.context.fill();
};

Renderer.prototype.drawStart = function() {
  var editorPoint = PointConverter.worldToEditor(this.world.start, this.world.screen);

  this.context.fillStyle = 'green';
  this.context.beginPath();
  this.context.arc(editorPoint[0], editorPoint[1], 10, 0, Math.PI*2, true);
  this.context.closePath();
  this.context.fill();
};

Renderer.prototype.drawScreen = function() {
  var editorPosition = PointConverter.worldToEditor(this.world.screen.position, this.world.screen);
  var editorSize = UnitConverter.worldToEditor(this.world.screen.size, this.world.screen);

  this.context.globalAlpha = 0.4;
  this.context.fillStyle = 'white';
  this.context.fillRect(
    editorPosition[0]-editorSize[0]/2,
    editorPosition[1]-editorSize[1]/2,
    editorSize[0],
    editorSize[1]
  );
  this.context.globalAlpha = 1;

  var crossHairSize = 14;
  var crossHairWidth = 2;
  this.context.fillStyle = 'yellow';
  this.context.fillRect(
    editorPosition[0]-crossHairWidth/2,
    editorPosition[1]-crossHairSize/2,
    crossHairWidth,
    crossHairSize
  );
  this.context.fillRect(
    editorPosition[0]-crossHairSize/2,
    editorPosition[1]-crossHairWidth/2,
    crossHairSize,
    crossHairWidth
  );
};

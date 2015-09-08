function World() {
  this.points = [];
  this.polygons = [];
  this.screen = { position: Voy.Point.zero(), size: new Voy.Point(800, 600) };
  this.selectedPoints = [];
  this.selectedPolygonTypeId = 1;
  this.polygonTypes = PolygonTypeRegistry.getInstance();
}

World.prototype.findPoint = function(point) {
  var currentPoint;
  for(var i=0; this.points.length>i; i++) {
    currentPoint = this.points[i];
    if(
      currentPoint[0]-World.findTolerance <= point[0] &&
      currentPoint[0]+World.findTolerance >= point[0] &&
      currentPoint[1]-World.findTolerance <= point[1] &&
      currentPoint[1]+World.findTolerance >= point[1]
    ) return currentPoint;
  }
};

World.prototype.getSelectedPolygonType = function() {
  return this.polygonTypes.find(this.selectedPolygonTypeId);
};

World.prototype.selectNextPolygonType = function() {
  this.selectedPolygonTypeId += 1;
  if(this.polygonTypes.list.length+1 == this.selectedPolygonTypeId) this.selectedPolygonTypeId = 1;
};

World.prototype.selectPreviousPolygonType = function() {
  this.selectedPolygonTypeId -= 1;
  if(this.selectedPolygonTypeId == 0) {
    this.selectedPolygonTypeId = this.polygonTypes.list.length;
  }
};

World.prototype.togglePoint = function(point) {
  var index = this.selectedPoints.indexOf(point);
  if(index === -1)
    this.selectedPoints.push(point);
  else
    this.selectedPoints.splice(index, 1);
};

World.findTolerance = 30;

World.prototype.isPointSelected = function(point) {
  var index = this.selectedPoints.indexOf(point);
  return index !== -1;
};

World.prototype.deselectPoints = function() {
  while(this.selectedPoints[0]) {
    this.togglePoint(this.selectedPoints[0]);
  }
};

World.prototype.findPolygonsThatHasPoint = function(point) {
  var polygons = [], polygon;
  for(var i=0; this.polygons.length>i; i++) {
    polygon = this.polygons[i];
    if(polygon.hasPoint(point)) polygons.push(polygon);
  }
  return polygons;
};

World.prototype.removePolygon = function(polygon) {
  var index = this.polygons.indexOf(polygon);
  if(index === -1) throw new Error('Polygon does not exist.');
  this.polygons.splice(index, 1);
};

World.prototype.removeSelectedPoints = function() {
  var polygons;
  while(this.selectedPoints[0]) {
    this.points.splice(this.points.indexOf(this.selectedPoints[0]), 1);
    polygons = this.findPolygonsThatHasPoint(this.selectedPoints[0]);
    polygons.forEach(function(polygon) {
      this.removePolygon(polygon);
    }.bind(this));
    this.togglePoint(this.selectedPoints[0]);
  }
};

World.prototype.toData = function() {
  var world = {
    walls: [],
    player: {
      position: this.start.toArray()
    },
    goal: {
      position: this.goal.toArray()
    }
  };

  this.polygons.forEach(function(polygon) {
    var center = Voy.Point.zero();
    polygon.points.forEach(function(point) {
      center.add(point);
    });
    center.divide(polygon.points.length);
    center.round();

    var wall = {
      points: [],
      position: center.toArray(),
      polygonTypeId: polygon.type.id
    };

    polygon.points.forEach(function(point) {
      var localPoint = Voy.Point.subtract(point, center);
      wall.points.push(localPoint.toArray());
    });
    world.walls.push(wall);
  });

  return world;
};

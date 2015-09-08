function Controller(world, writer) {
  this.world = world;
  this.writer = writer;
}

Controller.prototype.clicked = function(position) {
  var worldPoint = PointConverter.editorToWorld(position, this.world.screen);
  var exitingWorldPoint = this.world.findPoint(worldPoint);
  if(exitingWorldPoint) {
    this.world.togglePoint(exitingWorldPoint);
  } else {
    this.world.points.push(worldPoint);
    this.world.togglePoint(worldPoint);
  }
};

Controller.prototype.cPressed = function(position) {
  if(this.world.selectedPoints.length <= 2) {
    alert('Too few polygons selected.')
    return;
  }
  var polygon = new Polygon(this.world.getSelectedPolygonType());
  this.world.selectedPoints.forEach(function(point) {
    polygon.points.push(point);
  }.bind(this));
  if(!polygon.isValid()) {
    alert('Polygon is not convex!');
    return;
  }
  this.world.deselectPoints();
  this.world.polygons.push(polygon);
};

Controller.prototype.mPressed = function() {
  UnitConverter.scale += .2;
};

Controller.prototype.pPressed = function() {
  UnitConverter.scale -= .2;
};

Controller.prototype.rPressed = function() {
  this.world.removeSelectedPoints();
};

Controller.prototype.wPressed = function() {
  this.writer.execute();
};

Controller.prototype.dPressed = function() {
  this.world.deselectPoints();
};

Controller.prototype.gPressed = function() {
  this.world.goal = this.world.screen.position.clone();
};

Controller.prototype.iPressed = function() {
  console.log(this.world.screen.position.toString());
};

Controller.prototype.sPressed = function() {
  this.world.start = this.world.screen.position.clone();
};

Controller.prototype.leftPressed = function() {
  this.handleMove(-Controller.moveSpeed, 0);
};

Controller.prototype.rightPressed = function() {
  this.handleMove(Controller.moveSpeed, 0);
};

Controller.prototype.upPressed = function() {
  this.handleMove(0, -Controller.moveSpeed);
};

Controller.prototype.downPressed = function() {
  this.handleMove(0, Controller.moveSpeed);
};

Controller.prototype.zPressed = function() {
  this.world.selectNextPolygonType();
};

Controller.prototype.xPressed = function() {
  this.world.selectPreviousPolygonType();
};

Controller.prototype.handleMove = function(x, y) {
  var targets, targetsArePoints = false;
  if(this.world.selectedPoints.length != 0) {
    targetsArePoints = true;
    targets = this.world.selectedPoints;
  } else {
    targets = [this.world.screen.position];
  }
  var translation = new Voy.Vector2(x*UnitConverter.scale, y*UnitConverter.scale);
  translation.round();

  targets.forEach(function(target) {
    target.add(translation);
  });

  if(targetsArePoints) {
    var moveValid = true, polygons;
    for(var i=0; targets.length>i && moveValid; i++) {
      polygons = this.world.findPolygonsThatHasPoint(targets[i]);
      for(var n=0; polygons.length>n; n++) {
        if(!polygons[n].isValid()) {
          moveValid = false;
          break;
        }
      }
    }

    if(!moveValid) {
      alert('Move not allowed. Makes polygon concave.');
      targets.forEach(function(target) {
        target.subtract(translation);
      });
    }
  }
};

Controller.moveSpeed = 10;

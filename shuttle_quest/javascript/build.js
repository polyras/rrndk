Number.prototype.clamp = function(min, max) {
  return Math.max(min, Math.min(this, max));
};


window.requestAnimationFrame = (function() {
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();


var Voy = {};


Voy.Game = function() {
  this.componentRegistry = new Voy.ComponentRegistry();

  this.assets = new Voy.AssetManager();

  this.renderer = new Voy.Renderer();

  this.physics = new Voy.PhysicsEngine(
    new Voy.ComponentFeeder(this.componentRegistry, 'rigidBody', 'collider')
  );

  Voy.Keyboard.initialize();
  Voy.Mouse.initialize(this.getCanvasElement());
  this.mouse = Voy.Mouse.getInstance();
};

Voy.Game.prototype.getCanvasElement = function() {
  return this.renderer.getCanvasElement();
};

Voy.Game.prototype.run = function() {
  this.tick();
};

Voy.Game.prototype.tick = function(timestamp) {
  var timeDelta = this.lastTickAt ? timestamp - this.lastTickAt : 0;
  this.update(Math.round(timeDelta));
  this.lastTickAt = timestamp;
  this.scheduleNextTick();
};

Voy.Game.prototype.update = function(timeDelta) {
  if(this.scene.completed) this.changeScene(this.getNextScene());
  this.scene.update(timeDelta);
  this.physics.update(timeDelta);
  this.renderer.render(this.scene);
  this.physics.resetForces();
  this.mouse.reset();
};

Voy.Game.prototype.scheduleNextTick = function() {
  requestAnimationFrame(this.tick.bind(this));
};

Voy.Game.prototype.changeScene = function(scene) {
  if(this.scene) this.scene.exit();

  scene.assets = this.assets;
  scene.renderer = this.renderer;
  scene.componentRegistry = this.componentRegistry;

  scene.setup();
  scene.initialize();
  this.scene = scene;
};


Voy.Vector2 = function(component0, component1) {
  this[0] = component0;
  this[1] = component1;
};

Voy.Vector2.prototype.add = function(vector) {
  var result = Voy.Vector2.add(this, vector);
  this.set(result);
};

Voy.Vector2.prototype.subtract = function(vector) {
  var result = Voy.Vector2.subtract(this, vector);
  this.set(result);
};

Voy.Vector2.prototype.multiply = function(factor) {
  var result = Voy.Vector2.multiply(this, factor);
  this.set(result);
};

Voy.Vector2.prototype.clone = function(factor) {
  var vector = new Voy.Vector2(this[0], this[1]);
  return vector;
};

Voy.Vector2.prototype.toPoint = function() {
  var point = new Voy.Point(this[0], this[1]);
  return point;
};

Voy.Vector2.prototype.rotate = function(angle) {
  var rotation = Voy.Matrix2.rotation(angle);
  this.set(
    Voy.Matrix2.multiply(rotation, this)
  );
};

Voy.Vector2.prototype.toString = function() {
  return "(" + this[0] + ", " + this[1] + ")";
};

Voy.Vector2.prototype.divide = function(divisor) {
  var result = Voy.Vector2.divide(this, divisor);
  this.set(result);
};

Voy.Vector2.prototype.getPerpendicular = function() {
  var vector = new Voy.Vector2(
    this[1]*-1,
    this[0]
  );
  return vector;
};

Voy.Vector2.prototype.set = function(vector) {
  this[0] = vector[0];
  this[1] = vector[1];
};

Voy.Vector2.prototype.truncate = function(maxLength) {
  var length = this.getLength();
  if(length && length > maxLength) {
    this.normalize();
    this.multiply(maxLength);
  }
};

Voy.Vector2.prototype.getDotProduct = function(vector) {
  var dotProduct = this[0]*vector[0] + this[1]*vector[1];
  return dotProduct;
};

Voy.Vector2.prototype.getLength = function() {
  return Math.sqrt(this.getLengthSquared());
};

Voy.Vector2.prototype.reset = function() {
  this[0] = 0;
  this[1] = 0;
};

Voy.Vector2.prototype.round = function() {
  this[0] = Math.round(this[0]);
  this[1] = Math.round(this[1]);
};

Voy.Vector2.prototype.toArray = function() {
  return [this[0], this[1]];
};

Voy.Vector2.prototype.getCrossProduct = function(vector) {
  return this[0]*vector[1]-this[1]*vector[0];
};

Voy.Vector2.prototype.isZero = function() {
  return this[0] === 0 && this[1] === 0;
}

Voy.Vector2.prototype.getLengthSquared = function() {
  return Math.pow(this[0], 2) + Math.pow(this[1], 2);
};

Voy.Vector2.prototype.normalize = function() {
  var vector = Voy.Vector2.normalize(this);
  this.set(vector);
};

Voy.Vector2.prototype.getNormalized = function() {
  var vector = Voy.Vector2.normalize(this);
  return vector;
};

Voy.Vector2.prototype.negate = function() {
  var vector = Voy.Vector2.negate(this);
  this.set(vector);
};

Voy.Vector2.add = function(vector1, vector2) {
  var result = new Voy.Vector2(
    vector1[0] + vector2[0],
    vector1[1] + vector2[1]
  );
  return result;
};

Voy.Vector2.subtract = function(vector1, vector2) {
  var result = new Voy.Vector2(
    vector1[0] - vector2[0],
    vector1[1] - vector2[1]
  );
  return result;
};

Voy.Vector2.multiply = function(vector, factor) {
  var result = new Voy.Vector2(
    vector[0]*factor,
    vector[1]*factor
  );
  return result;
};

Voy.Vector2.divide = function(vector, divisor) {
  var result = new Voy.Vector2(
    vector[0]/divisor,
    vector[1]/divisor
  );
  return result;
};

Voy.Vector2.zero = function() {
  var vector = new Voy.Vector2(0, 0);
  return vector;
};

Voy.Vector2.up = function() {
  var vector = new Voy.Vector2(0, 1);
  return vector;
};

Voy.Vector2.right = function() {
  var vector = new Voy.Vector2(1, 0);
  return vector;
};

Voy.Vector2.normalize = function(vector) {
  var vector = this.divide(vector, vector.getLength());
  return vector;
};

Voy.Vector2.negate = function(vector) {
  var vector = new Voy.Vector2(
    -vector[0],
    -vector[1]
  );
  return vector;
};


Voy.Matrix2 = function() {
  var column, i;

  for(i=0; 2>i; i++) {
    this[i] = [];
  }

  for(var i=0; arguments.length>i; i++) {
    column = i % 2;
    this[column][Math.floor(i/2)] = arguments[i];
  }
};

Voy.Matrix2.rotation = function(angle) {
  var matrix = new Voy.Matrix2(
    Math.cos(angle), -Math.sin(angle),
    Math.sin(angle), Math.cos(angle)
  );
  return matrix;
};

Voy.Matrix2.multiply = function(matrix, vector) {
  var resultVector = Voy.Vector2.zero();

  for(var row=0; 2>row; row++) {
    for(var column=0; 2>column; column++) {
      resultVector[row] += matrix[column][row] * vector[column]
    }
  }

  return resultVector;
};


Voy.EventEmitter = {
  getCallbacks: function() {
    if(!this.callbacks) this.callbacks = {};
    return this.callbacks;
  },
  on: function(type, callback) {
    var callbacks = this.getCallbacks()[type];
    if(!callbacks) {
      callbacks = [];
      this.getCallbacks()[type] = callbacks;
    }
    callbacks.push(callback);
  },
  emit: function() {
    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    var callbacks = this.getCallbacks()[type];
    if(callbacks) {
      callbacks.forEach(function(callback) {
        callback.apply(null, args);
      });
    }
  }
};


Voy.Component = function(type) {
  this.type = type;
}

Voy.Component.prototype.initialize = function() { };
Voy.Component.prototype.setup = function() { };

Voy.Component.prototype.getScene = function() {
  return this.entity.getScene();
};


Voy.ComponentFeeder = function(componentRegistry, types) {
  var arguments = Array.prototype.slice.call(arguments);
  var componentRegistry = arguments.shift();

  this.types = arguments;

  componentRegistry.on('add', this.checkAdd.bind(this));
  componentRegistry.on('remove', this.checkRemove.bind(this));
};

Voy.ComponentFeeder.prototype = Object.create(Voy.EventEmitter);

Voy.ComponentFeeder.prototype.checkAdd = function(component) {
  if(this.matches(component)) this.emit('add', component);
};

Voy.ComponentFeeder.prototype.checkRemove = function(component) {
  if(this.matches(component)) this.emit('remove', component);
};

Voy.ComponentFeeder.prototype.matches = function(component) {
  return this.types.indexOf(component.type) != -1;
};


Voy.EntityContainer = function() {
  this.children = [];
};

Voy.EntityContainer.prototype.addChild = function(entity) {
  entity.parent = this;
  this.children.push(entity);
};

Voy.EntityContainer.prototype.setup = function() {
  this.children.forEach(function(child) {
    child.setup();
  });
};

Voy.EntityContainer.prototype.initialize = function() {
  this.children.forEach(function(child) {
    child.initialize();
  });
};

Voy.EntityContainer.prototype.removeChild = function(entity) {
  var index = this.children.indexOf(entity);
  if(index == -1) throw new Error('Cannot remove child.');
  entity.parent = null;
  this.children.splice(index, 1);
};

Voy.EntityContainer.prototype.updateChildren = function(timeDelta) {
  this.children.forEach(function(child) {
    child.update(timeDelta);
  });
};

Voy.EntityContainer.prototype.findEntityWithTag = function(tag) {
  var child, grandChild;
  for(var i=0; this.children.length>i; i++) {
    child = this.children[i];
    if(child.hasTag(tag)) return child;
  }
  for(var i=0; this.children.length>i; i++) {
    child = this.children[i];
    grandChild = child.findEntityWithTag(tag);
    if(grandChild) return grandChild;
  }
};


Voy.Entity = function() {
  Voy.EntityContainer.call(this);

  this.components = [];
  this.tags = [];

  this.localPosition = Voy.Vector2.zero();
  this.localRotation = 0;

  var components = Array.prototype.slice.call(arguments);
  components.forEach(function(component) {
    this.addComponent(component);
  }.bind(this));
};

Voy.Entity.prototype = Object.create(Voy.EntityContainer.prototype);

Voy.Entity.prototype.getScene = function() {
  return this.parent.getScene();
};

Voy.Entity.prototype.setup = function() {
  this.components.forEach(function(component) {
    component.setup();
  });
  Voy.EntityContainer.prototype.setup.call(this);
};

Voy.Entity.prototype.initialize = function() {
  this.components.forEach(function(component) {
    component.initialize();
  });
  Voy.EntityContainer.prototype.initialize.call(this);
};

Voy.Entity.prototype.addTag = function(tag) {
  this.tags.push(tag);
};

Voy.Entity.prototype.hasTag = function(tag) {
  var index = this.tags.indexOf(tag);
  return index !== -1;
};

Voy.Entity.prototype.notify = function() {
  var args = Array.prototype.slice.call(arguments);
  var type = args.shift();
  this.components.forEach(function(component) {
    if(component[type]) component[type].apply(component, args);
  });
};

Voy.Entity.prototype.addComponent = function(component) {
  if(this[component.type]) throw new Error('Already got a component of type "' + component.type + '".');
  this[component.type] = component;
  this.components.push(component);
  component.entity = this;
}

Voy.Entity.prototype.getPosition = function() {
  return Voy.Vector2.add(this.parent.getPosition(), this.localPosition);
};

Voy.Entity.prototype.getRotation = function() {
  return this.parent.getRotation()+this.localRotation;
};

Voy.Entity.prototype.update = function(timeDelta) {
  this.components.forEach(function(component) {
    if(component.update) component.update(timeDelta);
  });
  this.updateChildren(timeDelta);
};


Voy.Shape = function(position) {
  this.position = position;
};


Voy.Polygonic = function(position, rotation) {
  Voy.Shape.call(this, position);
  this.rotation = typeof(rotation) === 'undefined' ? 0 : rotation;
};

Voy.Polygonic.prototype = Object.create(Voy.Shape);

Voy.Polygonic.prototype.getVertices = function() {
  var vertices = this.getLocalVertices();

  vertices.forEach(function(vertex) {
    vertex.add(this.position);
  }.bind(this));

  if(this.rotation) {
    vertices.forEach(function(vertex) {
      vertex.rotate(this.position, this.rotation);
    }.bind(this));
  }

  return vertices;
};

Voy.Polygonic.prototype.project = function(axis) {
  var vertices = this.getVertices();
  var min = axis.getDotProduct(vertices[0]);
  var max = min;
  var projection;
  for(var i=1; vertices.length>i; i++) {
    projection = axis.getDotProduct(vertices[i]);
    if(projection < min) {
      min = projection;
    }
    else if(projection > max) {
      max = projection;
    }
  }
  projection = new Voy.Projection(min, max);
  return projection;
};

Voy.Polygonic.prototype.getClosestPoint = function(circle) {
  if(!(circle instanceof Voy.Circle)) throw new Error('Voy.Polygonic#getClosestPoint only supports circles at the moment.');
  var lineSegments = this.getLineSegments();
  var lineSegment, shortestDistance, distance, point, closestPoint;

  for(var i=0; lineSegments.length>i; i++) {
    lineSegment = lineSegments[i];
    point = lineSegment.getClosestPoint(circle.position);
    distance = point.getSquaredDistanceToPoint(circle.position);
    if(!shortestDistance || distance < shortestDistance) {
      shortestDistance = distance;
      closestPoint = point;
    }
  }

  return closestPoint;
};

Voy.Polygonic.prototype.getNormals = function() {
  var lineSegments = this.getLineSegments();
  var normals = [];
  lineSegments.forEach(function(lineSegment) {
    var normal = lineSegment.getPointsDifference().getPerpendicular().getNormalized();
    normals.push(normal)
  });
  return normals;
};


Voy.Rectangle = function(position, size, rotation) {
  Voy.Polygonic.call(this, position, rotation);
  if(!size) throw new Error('Rectangle needs size.');
  this.size = size;
};

Voy.Rectangle.prototype = Object.create(Voy.Polygonic.prototype);

Voy.Rectangle.prototype.getLocalVertices = function() {
  var halfSize = Voy.Vector2.multiply(this.size, 0.5);

  var vertices = [
    new Voy.Point(-halfSize[0], -halfSize[1]),
    new Voy.Point(+halfSize[0], -halfSize[1]),
    new Voy.Point(-halfSize[0], +halfSize[1]),
    new Voy.Point(+halfSize[0], +halfSize[1])
  ];

  return vertices;
};

Voy.Rectangle.prototype.getLineSegments = function() {
  var vertices = this.getVertices();
  var lineSegments = [
    new Voy.LineSegment(vertices[0], vertices[1]),
    new Voy.LineSegment(vertices[1], vertices[3]),
    new Voy.LineSegment(vertices[3], vertices[2]),
    new Voy.LineSegment(vertices[2], vertices[0])
  ];
  return lineSegments;
};


Voy.Polygon = function(position, points, rotation) {
  Voy.Polygonic.call(this, position, rotation);
  if(!points || !points.length) throw new Error('Polygon needs points.');
  this.points = points;
};

Voy.Polygon.prototype = Object.create(Voy.Polygonic.prototype);

Voy.Polygon.prototype.getLocalVertices = function() {
  var vertices = [];
  this.points.forEach(function(point) {
    vertices.push(point.clone());
  });
  return vertices;
};

Voy.Polygon.prototype.getLineSegments = function() {
  var vertices = this.getVertices();
  var lineSegments = [];
  for(var i=0; vertices.length-1>i; i++) {
    lineSegments.push(new Voy.LineSegment(vertices[i], vertices[i+1]));
  }
  lineSegments.push(new Voy.LineSegment(vertices[i], vertices[0]));
  return lineSegments;
};


Voy.Circle = function(position, radius) {
  Voy.Shape.call(this, position);
  this.radius = radius;
};

Voy.Circle.prototype = Object.create(Voy.Shape.prototype);

Voy.Circle.prototype.project = function(axis) {
  var centerProjection = axis.getDotProduct(this.position);
  var projection = new Voy.Projection(centerProjection-this.radius, centerProjection+this.radius);
  return projection;
};

Voy.Circle.prototype.getDistanceToLineSegment = function(lineSegment) {
  return lineSegment.getDistanceToPoint(this.position)-this.radius;
};


Voy.Projection = function(min, max) {
  this.min = min;
  this.max = max;
};

Voy.Projection.prototype.overlaps = function(projection) {
  if(this.max <= projection.min) return false;
  if(this.min >= projection.max) return false;

  return true;
};

Voy.Projection.prototype.getOverlap = function(projection) {
  var min = Math.max(this.min, projection.min);
  var max = Math.min(this.max, projection.max);
  return max-min;
};


Voy.LineSegment = function(point0, point1) {
  this[0] = point0;
  this[1] = point1;
};

Voy.LineSegment.prototype.getLength = function() {
  var pointsDifference = this.getPointsDifference();
  return pointsDifference.getLength();
};

Voy.LineSegment.prototype.getLengthSquared = function() {
  var pointsDifference = this.getPointsDifference();
  return pointsDifference.getLengthSquared();
};

Voy.LineSegment.prototype.getPointsDifference = function() {
  return Voy.Vector2.subtract(this[1], this[0]);
};

Voy.LineSegment.prototype.toString = function() {
  return this[0].toString() + ", " + this[1].toString();
};

Voy.LineSegment.prototype.getClosestPoint = function(point) {
  var lengthSquared = this.getLengthSquared();
  if(lengthSquared == 0) return this[0];

  var pointsDifference = this.getPointsDifference();
  var pointToLineSegmentStart = Voy.Vector2.subtract(point, this[0]);
  var progress = pointsDifference.getDotProduct(pointToLineSegmentStart)/lengthSquared;

  if(progress < 0) return this[0];
  if(progress > 1) return this[1];

  var projection = Voy.Vector2.add(
    this[0],
    Voy.Vector2.multiply(pointsDifference, progress)
  )
  var projection = projection.toPoint();
  return projection;
};


Voy.Point = function(component0, component1) {
  Voy.Vector2.call(this, component0, component1);
};

Voy.Point.prototype = Object.create(Voy.Vector2.prototype);

Voy.Point.prototype.getDistanceToPoint = function(point) {
  var difference = Voy.Vector2.subtract(this, point);
  return difference.getLength();
};

Voy.Point.prototype.getSquaredDistanceToPoint = function(point) {
  var difference = Voy.Vector2.subtract(this, point);
  return difference.getLengthSquared();
};

Voy.Point.prototype.clone = function() {
  return new Voy.Point(this[0], this[1]);
};

Voy.Point.prototype.rotate = function(rotationPoint, angle) {
  this.subtract(rotationPoint);
  var rotation = Voy.Matrix2.rotation(angle);
  this.set(
    Voy.Matrix2.multiply(rotation, this)
  );
  this.add(rotationPoint);
};

Voy.Point.zero = function() {
  var vector = Voy.Vector2.zero();
  return Voy.Point.createFromVector(vector);
};

Voy.Point.subtract = function(point1, point2) {
  return Voy.Vector2.subtract(point1, point2).toPoint();
};

Voy.Point.multiply = function(point1, point2) {
  return Voy.Vector2.multiply(point1, point2).toPoint();
};

Voy.Point.createFromVector = function(vector) {
  var point = new Voy.Point(vector[0], vector[1]);
  return point;
};

Voy.Point.createFromArray = function(array) {
  return new Voy.Point(array[0], array[1]);
};


Voy.PhysicsEngine = function(componentFeeder) {
  this.bodies = [];
  this.colliders = [];

  componentFeeder.on('add', this.addComponent.bind(this));
  componentFeeder.on('remove', this.removeComponent.bind(this));
  this.collisionDetector = new Voy.CollisionDetector();
}

Voy.PhysicsEngine.prototype.addComponent = function(component) {
  var list = this.getComponentList(component);
  list.push(component);
};

Voy.PhysicsEngine.prototype.getComponentList = function(component) {
  var list;
  switch(component.type) {
    case 'rigidBody':
    list = this.bodies;
    break
    case 'collider':
    list = this.colliders;
    break;
    default:
    throw new Error('Unknown component type.');
    break;
  }
  return list;
}

Voy.PhysicsEngine.prototype.removeComponent = function(component) {
  var list = this.getComponentList(component);
  var index = list.indexOf(component);
  if(index === -1) throw new Error('Cannot remove.');
  list.splice(index, 1);
};

Voy.PhysicsEngine.prototype.update = function(timeDelta) {
  this.simulate(timeDelta);
  this.handleCollisions();
};

Voy.PhysicsEngine.prototype.simulate = function(timeDelta) {
  this.bodies.forEach(function(body) {
    if(!body.simulate) console.log(body);
    body.simulate(timeDelta);
  }.bind(this));
};

Voy.PhysicsEngine.prototype.handleCollisions = function() {
  this.collisionDetector.update(this.colliders);
  this.collisionDetector.collisions.forEach(function(collision) {
    if(collision.isPhysical()) collision.resolve();
    collision.notify();
  });
};

Voy.PhysicsEngine.prototype.resetForces = function() {
  this.bodies.forEach(function(body) {
    body.resetForce();
  }.bind(this));
};


Voy.Collider = function() {
  Voy.Component.call(this, 'collider');
};

Voy.Collider.prototype = Object.create(Voy.Component.prototype);

Voy.Collider.prototype.initialize = function() {
  this.shape.position = this.getPosition();
};

Voy.Collider.prototype.getPosition = function() {
  return this.entity.getPosition();
};

Voy.Collider.prototype.getRotation = function() {
  return this.entity.getRotation();
};

Voy.Collider.prototype.getRigidBody = function() {
  return this.entity.rigidBody;
};

Voy.Collider.prototype.getShape = function() {
  this.shape.position = this.getPosition();
  if(this.shape instanceof Voy.Polygonic) this.shape.rotation = this.getRotation();
  return this.shape;
};


Voy.CollisionDetector = function() { };

Voy.CollisionDetector.prototype.update = function(colliders) {
  this.reset();

  colliders.forEach(function(collider1) {
    colliders.forEach(function(collider2) {
      if(collider1 != collider2) {
        if(!this.pairAlreadyTested(collider1, collider2)) {
          var collision = Voy.CollisionDetector.test(collider1, collider2);
          if(collision) this.collisions.push(collision);
          this.testedPairs.push([collider1, collider2]);
        }
      }
    }.bind(this));
  }.bind(this));
};

Voy.CollisionDetector.prototype.reset = function() {
  this.testedPairs = [];
  this.collisions = [];
};

Voy.CollisionDetector.prototype.pairAlreadyTested = function(collider1, collider2) {
  var testedPair;
  for(var i=0; this.testedPairs.length>i; i++) {
    testedPair = this.testedPairs[i];
    if(
      (testedPair[0] == collider1 && testedPair[1] == collider2) ||
      (testedPair[0] == collider2 && testedPair[1] == collider1)
    ) return true;
  }
};

Voy.CollisionDetector.test = function(collider1, collider2) {
  var rigidBody1 = collider1.getRigidBody();
  var rigidBody2 = collider2.getRigidBody();
  if(rigidBody1 && rigidBody2 && rigidBody1.static && rigidBody2.static) return null;

  var shape1 = collider1.getShape();
  var shape2 = collider2.getShape();

  if(shape1 instanceof Voy.Circle && shape2 instanceof Voy.Circle) return this.testCircle(collider1, collider2);

  var axes = this.getNormals(shape1, shape2);
  var axis, projection1, projection2;
  var smallestOverlap, overlap, smallestOverlapAxis;

  for(var i=0; axes.length>i; i++) {
    axis = axes[i];
    projection1 = shape1.project(axis);
    projection2 = shape2.project(axis);
    if(!projection1.overlaps(projection2)) {
      return false;
    } else {
      overlap = projection1.getOverlap(projection2);
      if(!smallestOverlap || overlap < smallestOverlap) {
        smallestOverlap = overlap;
        smallestOverlapAxis = axis;
      }
    }
  }

  var separation = Voy.Vector2.multiply(Voy.Vector2.normalize(smallestOverlapAxis), smallestOverlap);

  var centerDifference = Voy.Vector2.subtract(collider1.getPosition(), collider2.getPosition());
  if(separation.getDotProduct(centerDifference) < 0) separation.negate();

  var collision = new Voy.Collision(collider1.entity, collider2.entity, separation);
  return collision;
};

Voy.CollisionDetector.testCircle = function(collider1, collider2) {
  var centerDifference = Voy.Vector2.subtract(collider1.getPosition(), collider2.getPosition());
  var centerDifferenceLength = centerDifference.getLength();
  if(centerDifferenceLength < collider1.getRadius()+collider2.getRadius()) {
    var separation = Voy.Vector2.multiply(Voy.Vector2.normalize(centerDifference), collider1.getRadius()+collider2.getRadius()-centerDifferenceLength);
    var collision = new Voy.Collision(collider1.entity, collider2.entity, separation);
    return collision;
  }
};

Voy.CollisionDetector.getNormals = function(shape1, shape2) {
  if(shape1 instanceof Voy.Rectangle && shape2 instanceof Voy.Rectangle) {
    return this.getRectangleRectangleNormals(shape1, shape2);
  } else {
    var shape1IsCircle = shape1 instanceof Voy.Circle;
    var shape2IsCircle = shape2 instanceof Voy.Circle;
    if(shape1IsCircle && shape2IsCircle) throw new Error('I cannot find axes for two circles.');
    var eitherIsCircle = shape1IsCircle || shape2IsCircle;

    if(eitherIsCircle) {
      var circle, polygon;
      if(shape1IsCircle) {
        circle = shape1;
        polygon = shape2;
      } else {
        circle = shape2;
        polygon = shape1;
      }
      return [this.getCirclePolygonNormal(circle, polygon)];
    } else {
      return this.getPolygonicPolygonicNormals(shape1, shape2);
    }
  }
};

Voy.CollisionDetector.getPolygonicPolygonicNormals = function(polygonic1, polygonic2) {
  var axes = polygonic1.getNormals();
  axes = axes.concat(polygonic2.getNormals());
  return axes;
};

Voy.CollisionDetector.getRectangleRectangleNormals = function(rectangle1, rectangle2) {
  var rotation1 = rectangle1.rotation;
  var rotation2 = rectangle2.rotation;

  var up = Voy.Vector2.up();
  var right = Voy.Vector2.right();

  if(rotation1 == rotation2) {
    if(rotation1 == 0) {
      return [up, right];
    } else {
      up.rotate(rotation1);
      right.rotate(rotation2);
      return [up, right];
    }
  } else {
    var up1 = up.clone();
    up1.rotate(rotation1);
    var right1 = right.clone();
    right1.rotate(rotation1);

    var up2 = up.clone();
    up2.rotate(rotation2);
    var right2 = right.clone();
    right2.rotate(rotation2);

    var normals = [up1, right1, up2, right2];
    return normals;
  }
};

Voy.CollisionDetector.getCirclePolygonNormal = function(circle, polygon) {
  var closestPoint = polygon.getClosestPoint(circle);
  var pointCircleDifference = Voy.Vector2.subtract(closestPoint, circle.position);
  return pointCircleDifference.getNormalized();
};


Voy.Collision = function(entity0, entity1, separation) {
  this[0] = entity0;
  this[1] = entity1;
  this.separation = separation;

  if(this.isPhysical()) {
    this.normal = Voy.Vector2.normalize(this.separation);
    this.velocityDifference = Voy.Vector2.subtract(this[0].rigidBody.velocity, this[1].rigidBody.velocity);
    this.velocityAlongNormal = this.velocityDifference.getDotProduct(this.normal);
  }
};

Voy.Collision.prototype.getOther = function(entity) {
  var index = entity == this[0] ? 1 : 0;
  return this[index];
};

Voy.Collision.prototype.isPhysical = function() {
  return !!this[0].rigidBody && !!this[1].rigidBody;
};

Voy.Collision.prototype.notify = function() {
  this[0].notify('collided', this);
  this[1].notify('collided', this);
};

Voy.Collision.prototype.resolve = function() {
  // Improvement possibility
  // Currently the effort and time going "into" the other body is essentially neutralized.
  // For a even more perfect simulation one would calculate how much time each moving body
  // lost due to this separation translation. Something like:
  // timeLost = this.separation.getLength()/velocity.getLength()
  // and then when the new velocity is calculated
  // position.add(timeLost*velocity)
  // Until I haven't really needed this, so for simplicity's sake I haven't added it.

  this[0].localPosition.add(Voy.Vector2.multiply(this.separation, 1.001));

  if(this.velocityAlongNormal > 0) return false;

  var bounciness = Math.min(this[0].rigidBody.bounciness, this[1].rigidBody.bounciness);

  var impulsePower = -this.velocityAlongNormal*(1+bounciness)*1.01;

  var noStatic = !this[0].rigidBody.static && !this[1].rigidBody.static;
  if(noStatic) impulsePower /= 1/this[0].rigidBody.mass + 1/this[1].rigidBody.mass;
  var impulse = Voy.Vector2.multiply(this.normal, impulsePower);

  if(noStatic) {
    this[0].rigidBody.velocity.add(
      Voy.Vector2.multiply(impulse, 1/this[0].rigidBody.mass)
    );
    this[1].rigidBody.velocity.subtract(
      Voy.Vector2.multiply(impulse, 1/this[1].rigidBody.mass)
    );
  } else {
    var nonStaticIndex = this[0].rigidBody.static ? 1 : 0;
    this[nonStaticIndex].rigidBody.velocity.add(impulse);
  }
};


Voy.RectangleCollider = function(size) {
  Voy.Collider.call(this);
  this.shape = new Voy.Rectangle(Voy.Point.zero(), size);
};

Voy.RectangleCollider.prototype = Object.create(Voy.Collider.prototype);


Voy.PolygonCollider = function(points) {
  Voy.Collider.call(this);
  this.shape = new Voy.Polygon(Voy.Point.zero(), points);
};

Voy.PolygonCollider.prototype = Object.create(Voy.Collider.prototype);


Voy.CircleCollider = function(radius) {
  Voy.Collider.call(this);
  this.shape = new Voy.Circle(Voy.Point.zero(), radius);
};

Voy.CircleCollider.prototype = Object.create(Voy.Collider.prototype);

Voy.CircleCollider.prototype.getRadius = function() {
  return this.shape.radius;
};


Voy.RigidBody = function(options) {
  Voy.Component.call(this, 'rigidBody');
  options = options || {};
  this.static = options.static || false;
  this.force = Voy.Vector2.zero();
  this.velocity = Voy.Vector2.zero();
  this.drag = typeof(options.drag) === 'undefined' ? 0.05 : options.drag;
  this.maxSpeed = typeof(options.maxSpeed) === 'undefined' ? 0.05 : options.maxSpeed;
  this.maxForce = typeof(options.maxForce) === 'undefined' ? 0.05 : options.maxForce;
  this.bounciness = typeof(options.bounciness) === 'undefined' ? 0.9 : options.bounciness;
  this.mass = typeof(options.mass) === 'undefined' ? 1 : options.mass;
};

Voy.RigidBody.prototype = Object.create(Voy.Component.prototype);

Voy.RigidBody.prototype.getLocalPosition = function() {
  return this.entity.localPosition;
};

Voy.RigidBody.prototype.simulate = function(timeDelta) {
  this.force.truncate(this.maxForce);

  this.velocity.add(
    Voy.Vector2.multiply(this.force, timeDelta)
  );
  this.velocity.multiply(1-this.drag);
  this.velocity.truncate(this.maxSpeed);

  this.getLocalPosition().add(
    Voy.Vector2.multiply(this.velocity, timeDelta)
  );
};

Voy.RigidBody.prototype.resetForce = function() {
  this.force.reset();
};


Voy.AssetManager = function() {
  this.setupLoader('images', new Voy.ImageLoader());
  this.setupLoader('texts', new Voy.TextLoader());
  this.setupLoader('sounds', new Voy.SoundLoader());
  this.activeLoadersCount = 0;
};

Voy.AssetManager.prototype = Object.create(Voy.EventEmitter);

Voy.AssetManager.prototype.setupLoader = function(propertyName, loader) {
  loader.on('started', this.loaderStarted.bind(this));
  loader.on('completed', this.loaderCompleted.bind(this));
  this[propertyName] = loader;
};

Voy.AssetManager.prototype.loaderStarted = function() {
  if(this.activeLoadersCount == 0) this.emit('loadingStarted');
  this.activeLoadersCount++;
};

Voy.AssetManager.prototype.loaderCompleted = function() {
  this.activeLoadersCount--;
  if(this.activeLoadersCount == 0) this.emit('loadingCompleted');
};


(function() {
  function Sound(audio) {
    this.audio = audio;
  }

  Sound.prototype = {
    play: function() {
      var audio = new Audio();
      audio.src = this.audio.src;
      audio.play();
      return audio;
    }
  };

  Voy.Sound = Sound;
})();


Voy.Loader = function() {
  this.paths = [];
  this.prefix = '';
  this.suffix = '';
};

Voy.Loader.prototype = Object.create(Voy.EventEmitter);

Voy.Loader.prototype.add = function(shortPath) {
  if(this.paths.length == 0) this.emit('started');
  this.paths.push(shortPath);
  var fullPath = this.getFullPath(shortPath);
  this.load(fullPath)
};

Voy.Loader.prototype.loaded = function(fullPath, asset) {
  var shortPath = this.getShortPath(fullPath);
  this[shortPath] = asset;

  var index = this.paths.indexOf(shortPath);
  if(index == -1) throw new Error('Cannot find asset (' + fullPath + ') in list of currently downloading assets.');

  this.paths.splice(index, 1);
  if(this.paths.length == 0) this.emit('completed');
};

Voy.Loader.prototype.getFullPath = function(shortPath) {
  return this.prefix + '/' + shortPath + this.suffix;
};

Voy.Loader.prototype.getShortPath = function(fullPath) {
  var pathWithoutPrefix = fullPath.substring(this.prefix.length+1);
  var shortPath = pathWithoutPrefix.substring(0, pathWithoutPrefix.length-this.suffix.length);
  return shortPath;
};


Voy.ImageLoader = function() {
  Voy.Loader.call(this);
};

Voy.ImageLoader.prototype = Object.create(Voy.Loader.prototype);

Voy.ImageLoader.prototype.load = function(path) {
  var image = new Image();
  image.onload = function() {
    this.loaded(path, image);
  }.bind(this);
  image.src = path;
};


Voy.TextLoader = function() {
  Voy.Loader.call(this);
};

Voy.TextLoader.prototype = Object.create(Voy.Loader.prototype);

Voy.TextLoader.prototype.load = function(path) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if(request.readyState === 4)
      this.loaded(path, request.responseText);
  }.bind(this);
  request.open('GET', path);
  request.send();
};


Voy.SoundLoader = function() {
  Voy.Loader.call(this);
};

Voy.SoundLoader.prototype = Object.create(Voy.Loader.prototype);

Voy.SoundLoader.prototype.load = function(path) {
  var audio = new Audio();
  var sound = new Voy.Sound(audio);
  audio.addEventListener('loadeddata', function() {
    this.loaded(path, sound);
  }.bind(this));
  audio.src = path;
};


Voy.ComponentRegistry = function() { };

Voy.ComponentRegistry.prototype = Object.create(Voy.EventEmitter);

Voy.ComponentRegistry.prototype.add = function(component) {
  this.emit('add', component);
};

Voy.ComponentRegistry.prototype.remove = function(component) {
  this.emit('remove', component);
};


Voy.Canvas = function() {
  this.scale = 1;
  this.element = document.createElement('canvas');
  this.context = this.element.getContext('2d');

  this.updateResolution(640, 480);
  this.text = new Voy.TextCanvas(this.context);
  this.savedAlphas = [];
};

Voy.Canvas.prototype.updateResolution = function(width, height) {
  this.element.width = width;
  this.element.height = height;
  this.resolution = new Voy.Vector2(width, height);
};

Voy.Canvas.prototype.drawCircle = function(radius, color, position, startAngle, endAngle) {
  if(!position) position = Voy.Point.zero();
  if(color) this.context.fillStyle = color;
  if(!startAngle) startAngle = 0;
  if(!endAngle) endAngle = Math.PI*2;

  this.context.beginPath();
  this.context.moveTo(0, 0);
  this.context.arc(position[0], position[1], radius, startAngle, endAngle, false);
  this.context.closePath();
  this.context.fill();
};

Voy.Canvas.prototype.translate = function(translation) {
  this.context.translate(translation[0], translation[1]);
};

Voy.Canvas.prototype.drawRectangle = function(size, color, position) {
  if(!position) position = Voy.Point.zero();
  if(color) this.context.fillStyle = color;
  this.context.fillRect(position[0]-size[0]/2, position[1]-size[1]/2, size[0], size[1]);
};

Voy.Canvas.prototype.drawPolygon = function(points, color) {
  if(color) this.context.fillStyle = color;

  this.context.beginPath();
  this.context.moveTo(points[0][0], points[0][1]);
  for(var i=1; points.length>i; i++) {
    this.context.lineTo(points[i][0], points[i][1]);
  }
  this.context.lineTo(points[0][0], points[0][1]);
  this.context.closePath();
  this.context.fill();
};

Voy.Canvas.prototype.drawImage = function(image, position) {
  if(!position) position = Voy.Point.zero();
  this.context.drawImage(image, position[0]-image.width/2, position[1]-image.height/2);
};

Voy.Canvas.prototype.clear = function(color) {
  this.context.fillStyle = color;
  this.context.fillRect(0, 0, this.element.width, this.element.height);
};

Voy.Canvas.prototype.flipHorizontally = function() {
  this.context.scale(-1, 1);
};

Voy.Canvas.prototype.save = function() {
  this.context.save();
  this.savedAlphas.push(this.globalAlpha);
};

Voy.Canvas.prototype.applyOpacity = function(opacity) {
  this.context.globalAlpha *= opacity;
};

Voy.Canvas.prototype.restore = function() {
  this.context.restore();
  this.context.globalAlpha = this.savedAlphas.pop();
};

Voy.Canvas.prototype.rotate = function(angle) {
  this.context.rotate(angle);
};


Voy.Renderer = function() {
  this.canvas = new Voy.Canvas();
};

Voy.Renderer.prototype.render = function(scene) {
  if(scene.clearColor) this.canvas.clear(scene.clearColor);
  this.drawChildren(scene);
};

Voy.Renderer.prototype.getCanvasElement = function() {
  return this.canvas.element;
};

Voy.Renderer.prototype.updateResolution = function(width, height) {
  this.canvas.updateResolution(width, height);
};

Voy.Renderer.prototype.drawEntity = function(entity) {
  this.canvas.save();

  this.canvas.translate(entity.localPosition);
  if(entity.localRotation) this.canvas.rotate(entity.localRotation);

  entity.components.forEach(function(component) {
    if(component.drawable) component.prepareAndDraw(this.canvas);
  }.bind(this));
  this.drawChildren(entity);
  this.canvas.restore();
};

Voy.Renderer.prototype.drawChildren = function(entityContainer) {
  entityContainer.children.forEach(function(child) {
    this.drawEntity(child);
  }.bind(this));
};


Voy.Layer = function(type) {
  if(!type) type = 'layer';
  Voy.Component.call(this, type);
  this.drawable = true;
  this.opacity = 1;
  this.flippedHorizontally = false;
};

Voy.Layer.prototype = Object.create(Voy.Component.prototype);

Voy.Layer.prototype.prepareAndDraw = function(canvas) {
  if(this.flippedHorizontally) canvas.flipHorizontally();
  if(this.opacity !== 1) canvas.applyOpacity(this.opacity);
  this.draw(canvas);
};


Voy.CircleLayer = function(radius, color) {
  if(!color) color = 'blue';
  Voy.Layer.call(this, 'circleLayer');
  this.color = color;
  this.radius = radius;
};

Voy.CircleLayer.prototype = Object.create(Voy.Layer.prototype);

Voy.CircleLayer.prototype.draw = function(canvas) {
  canvas.drawCircle(this.radius, this.color);
};


Voy.PolygonLayer = function(color, points) {
  Voy.Layer.call(this, 'polygonLayer');
  this.color = color;
  this.points = points;
};

Voy.PolygonLayer.prototype = Object.create(Voy.Layer.prototype);

Voy.PolygonLayer.prototype.draw = function(canvas) {
  canvas.drawPolygon(this.points, this.color);
};


Voy.Sprite = function(imageName, position) {
  this.position = position ? position : Voy.Vector2.zero();
  Voy.Layer.call(this, 'sprite');
  if(imageName) this.imageName = imageName;
};

Voy.Sprite.prototype = Object.create(Voy.Layer.prototype);

Voy.Sprite.prototype.initialize = function() {
  if(this.imageName) {
    this.image = this.getImage(this.imageName);
    delete this.imageName;
  }
};

Voy.Sprite.prototype.getImage = function(shortPath) {
  var assets = this.getScene().assets;
  var image = assets.images[shortPath];
  return image;
}

Voy.Sprite.prototype.draw = function(canvas) {
  canvas.drawImage(this.image, this.position);
};


Voy.RectangleLayer = function(size, color) {
  Voy.Layer.call(this, 'rectangleLayer');
  this.color = color;
  this.size = size;
};

Voy.RectangleLayer.prototype = Object.create(Voy.Layer.prototype);

Voy.RectangleLayer.prototype.draw = function(canvas) {
  canvas.drawRectangle(this.size, this.color);
};


Voy.TextCanvas = function(context) {
  this.context = context;
  context.textBaseline = 'middle';
  this.color = 'blue';
};

Voy.TextCanvas.prototype.setAlign = function(align) {
  this.context.textAlign = align;
};

Voy.TextCanvas.prototype.setFont = function(font) {
  this.context.font = font;
};

Voy.TextCanvas.prototype.draw = function(text, position) {
  this.context.fillStyle = this.color;
  if(!position) position = Voy.Point.zero();
  this.context.fillText(text, position[0], position[1]);
};


Voy.Scene = function() {
  Voy.EntityContainer.call(this);
};

Voy.Scene.prototype = Object.create(Voy.EntityContainer.prototype);

Voy.Scene.prototype.addChild = function(entity) {
  Voy.EntityContainer.prototype.addChild.call(this, entity);
  this.registerComponents(entity);
};

Voy.Scene.prototype.getScene = function() {
  return this;
};

Voy.Scene.prototype.registerComponents = function(entity) {
  entity.components.forEach(function(component) {
    this.componentRegistry.add(component);
  }.bind(this));

  entity.children.forEach(function(child) {
    this.registerComponents(child);
  }.bind(this));
};

Voy.Scene.prototype.exit = function() {
  this.children.forEach(function(child) {
    this.deregisterComponents(child);
  }.bind(this));
};

Voy.Scene.prototype.deregisterComponents = function(entity) {
  entity.components.forEach(function(component) {
    this.componentRegistry.remove(component);
  }.bind(this));

  entity.children.forEach(function(child) {
    this.deregisterComponents(child);
  }.bind(this));
};

Voy.Scene.prototype.getPosition = function() {
  return Voy.Vector2.zero();
};

Voy.Scene.prototype.getRotation = function() {
  return 0;
};

Voy.Scene.prototype.removeChild = function() {
  throw new Error('Muhaha, you cannot remove children from the scene. They are to remain in the scene for all perpetuity.');
};

Voy.Scene.prototype.update = function(timeDelta) {
  this.children.forEach(function(child) {
    child.update(timeDelta);
  });
};


(function() {
  var keyCodeMap = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
  };

  function Keyboard() {
    document.addEventListener('keydown', this.keyPressed.bind(this));
    document.addEventListener('keyup', this.keyReleased.bind(this));
    this.keysPressed = {};
  }
  Keyboard.prototype = {
    keyPressed: function(e) {
      var keyName = keyCodeMap[e.keyCode];
      if(keyName) {
        this.keysPressed[keyName] = true;
      }
    },
    keyReleased: function(e) {
      var keyName = keyCodeMap[e.keyCode];
      if(keyName && this.keysPressed[keyName]) {
        delete this.keysPressed[keyName];
      }
    },
    anyKeysPressed: function() {
      return Object.keys(this.keysPressed).length !== 0;
    }
  };

  Keyboard.initialize = function() {
    this.getInstance();
  };

  Keyboard.getInstance = function() {
    if(!this.instance) this.instance = new Keyboard();
    return this.instance;
  };

  Voy.Keyboard = Keyboard;
})();


Voy.Mouse = function(canvasElement) {
  this.position = Voy.Vector2.zero();
  canvasElement.addEventListener('mousedown', this.press.bind(this));
  document.addEventListener('mousemove', this.move.bind(this));
  this.canvasElement = canvasElement;
  this.clicked = false;
};

Voy.Mouse.prototype.press = function() {
  this.clicked = true;
};

Voy.Mouse.prototype.reset = function() {
  this.clicked = false;
};

Voy.Mouse.initialize = function(canvas) {
  this.instance = new Voy.Mouse(canvas);
};

Voy.Mouse.getInstance = function() {
  return this.instance;
};

Voy.Mouse.prototype.move = function(event) {
  this.position[0] = event.x-this.canvasElement.offsetLeft+document.body.scrollLeft;
  this.position[1] = event.y-this.canvasElement.offsetTop+document.body.scrollTop;
};


function Game() {
  Voy.Game.call(this);

  this.renderer.updateResolution(800, 600);

  this.assets.images.prefix = './images';

  this.assets.texts.prefix = './data';
  this.assets.texts.suffix = '.json';

  this.levels = new LevelRegistry();

  var scene = new LoadingScene(this.levels);
  this.changeScene(scene);

  this.timer = new Timer(Game.secondsPerLevel*1000);
}

Game.prototype = Object.create(Voy.Game.prototype);

Game.prototype.update = function(timeDelta) {
  this.timer.update(timeDelta);
  Voy.Game.prototype.update.call(this, timeDelta);
};

Game.prototype.makeWorldScene = function() {
  var scene = new WorldScene(this.timer, this.levels, this.levelNumber);;
  return scene;
};

Game.prototype.getNextScene = function() {
  var scene;

  if(this.scene instanceof LoadingScene) {
    this.levelNumber = 1;
    scene = this.makeWorldScene();
  }
  else if(this.scene instanceof WorldScene) {
    if(this.scene.outcome == 'fail') {
      this.levelNumber = 1;
      this.timer.windUp(Game.secondsPerLevel*1000);
      scene = this.makeWorldScene();
    } else {
      if(this.levelNumber == this.levels.count()) {
        scene = new CreditsScene(this.timer);
      } else {
        scene = new LevelCompletedScene(this.timer, this.levelNumber);
      }
    }
  }
  else if(this.scene instanceof LevelCompletedScene) {
    this.levelNumber++;
    scene = this.makeWorldScene();
  }
  else if(this.scene instanceof CreditsScene) {
    this.levelNumber = 1;
    scene = this.makeWorldScene();
  } else {
    throw new Error('I dont know what to do!');
  }

  return scene;
};

Game.secondsPerLevel = 10;


EntityFactory = {
  createSpaceship: function(position) {
    var radius = 48;

    var spaceship = new Voy.Entity(
      new Voy.RigidBody({
        drag: 0.05,
        maxSpeed: 2,
        maxForce: 0.006,
        bounciness: 0.5
      }),
      new Voy.CircleCollider(radius),
      new CollisionDamageInflictor(),
      new PlayerInput(),
      new WaterResistance(),
      new Thrust(),
      new Health(),
      new SpaceshipSprite()
    );
    spaceship.addTag('player');
    spaceship.localPosition = position;

    var engine = new Voy.Entity(new EngineRotator());
    engine.localPosition = new Voy.Vector2(-12, 18);

    var flame = new Voy.Entity(
      new FlameFlicker(),
      new SpaceshipFlameSprite()
    );
    engine.addChild(flame);

    var engineCase = new Voy.Entity(
      new Voy.Sprite('spaceship/engine.png', new Voy.Vector2(-14, 0))
    );
    engine.addChild(engineCase);

    spaceship.addChild(engine);

    return spaceship;
  },
  createWorld: function() {
    var world = new Voy.Entity(
      new Camera(1)
    );
    return world;
  },
  createRock: function(position) {
    var radius = 40;

    var rock = new Voy.Entity(
      new Voy.RigidBody({
        drag: 0.05,
        maxSpeed: 0.5,
        maxForce: 0.003,
        bounciness: 2,
        mass: 0.5
      }),
      new Voy.CircleCollider(radius),
      new Gravity(),
      new Voy.CircleLayer(radius, 'grey')
    );
    rock.localPosition = position;
    rock.addTag('rock');
    return rock;
  },
  createTriangle: function() {
    var radius = 40;

    var points = [
      new Voy.Point(-100, -100),
      new Voy.Point(100, -100),
      new Voy.Point(0, 100)
    ];

    var triangle = new Voy.Entity(
      new Voy.RigidBody({
        drag: 0.05,
        maxSpeed: 0.5,
        maxForce: 0.003,
        bounciness: 0.5,
        mass: 5
      }),
      new Voy.PolygonCollider(points),
      new Voy.PolygonLayer('blue', points)
    );
    triangle.localPosition = new Voy.Vector2(50, 50);
    return triangle;
  },
  createWall: function(position, points, type) {
    var wall = new Voy.Entity(
      new Voy.RigidBody({ static: true }),
      new Voy.PolygonCollider(points),
      new Voy.PolygonLayer(type.color, points)
    );

    wall.localPosition = position;
    return wall;
  },
  createBackground: function() {
    var background = new Voy.Entity(
      new Camera(0.05),
      new Voy.Sprite('bg.jpg')
    );

    return background;
  },
  createHUD: function(resolution) {
    var hud = new Voy.Entity();

    var timer = new Voy.Entity(new TimerLayer());
    timer.localPosition[0] = resolution[0] - 11;
    timer.localPosition[1] = 44;
    hud.addChild(timer);

    var healthCircle = new Voy.Entity(new HealthCircleLayer());
    healthCircle.localPosition = new Voy.Vector2(60, 60);
    hud.addChild(healthCircle);

    return hud;
  },
  createTide: function(tideConfig) {
    var tide = new Voy.Entity(
      new TidalForce(tideConfig.speed),
      new Voy.RectangleCollider(new Voy.Vector2(4000, 1120)),
      new WaterLayer()
    );
    tide.addTag('tide');
    tide.localPosition = Voy.Point.createFromArray(tideConfig.position);
    return tide;
  },
  createGoal: function(position) {
    var radius = 50;
    var goal = new Voy.Entity(
      new Voy.CircleCollider(radius),
      new Voy.Sprite('goal.png'),
      new Rotation(),
      new CollisionWin()
    );
    goal.localPosition = position;
    return goal;
  },
  createPresenter: function(resolution) {
    var presenter = new Voy.Entity(
      new ReadyFader(),
      new FadingBackgroundLayer(),
      new LevelProgressLayer(),
      new ReadyTextLayer()
    );
    presenter.localPosition = Voy.Point.multiply(resolution, 0.5).toPoint();
    return presenter;
  },
  createBlackout: function(resolution) {
    var blackout = new Voy.Entity(
      new DecidedFader(),
      new FadingBackgroundLayer()
    );
    blackout.localPosition = Voy.Point.multiply(resolution, 0.5).toPoint();
    return blackout;
  }
};


function PlayerInput() {
  Voy.Component.call(this, 'input');
  this.keyboard = Voy.Keyboard.getInstance();
}

PlayerInput.prototype = Object.create(Voy.Component.prototype);

PlayerInput.prototype.initialize = function() {
  this.scene = this.getScene();
};

PlayerInput.prototype.update = function() {
  var direction = Voy.Vector2.zero();

  if(this.scene.playing) {
    if(this.keyboard.keysPressed.right) direction[0] = 1;
    else if(this.keyboard.keysPressed.left) direction[0] = -1;
    if(this.keyboard.keysPressed.up) direction[1] = -1;
    else if(this.keyboard.keysPressed.down) direction[1] = 1;
    this.entity.thrust.boosterOn = this.keyboard.keysPressed.x;
  } else {
    this.entity.thrust.boosterOn = false;
  }
  this.entity.thrust.direction = direction;
};


function Camera(factor) {
  this.factor = factor;
  Voy.Component.call(this, 'input');
  this.keyboard = Voy.Keyboard.getInstance();
}

Camera.prototype = Object.create(Voy.Component.prototype);

Camera.prototype.initialize = function() {
  this.scene = this.getScene();
  this.player = this.scene.findEntityWithTag('player');
};

Camera.prototype.update = function() {
  var displacement = Voy.Vector2.negate(this.player.localPosition);
  displacement.multiply(this.factor);
  var resolution = this.scene.renderer.canvas.resolution;
  var halfResolution = Voy.Vector2.multiply(resolution, 0.5);
  this.entity.localPosition = Voy.Vector2.add(displacement, halfResolution);
};


function PolygonTypeRegistry() {
  this.list = [];

  this.add({
    id: 1,
    name: 'wood',
    color: '#883b11'
  });
  this.add({
    id: 2,
    name: 'stone',
    color: 'grey'
  });
  this.add({
    id: 3,
    name: 'earth',
    color: '#6c4d0a'
  });
  this.add({
    id: 4,
    name: 'vegetation',
    color: 'green'
  });
}

PolygonTypeRegistry.prototype.add = function(type) {
  this.list.push(type);
};

PolygonTypeRegistry.prototype.find = function(id) {
  for(var i=0; this.list.length>i; i++) {
    if(this.list[i].id == id) return this.list[i];
  }
};

PolygonTypeRegistry.prototype.forEach = function(callback) {
  this.list.forEach(callback);
};

PolygonTypeRegistry.getInstance = function() {
  if(!this.instance) this.instance = new this();
  return this.instance;
};


function WorldScene(timer, levels, levelNumber) {
  Voy.Scene.call(this);
  this.timer = timer;
  this.clearColor = 'rgb(200, 200, 200)';
  this.playing = false;
  this.keyboard = Voy.Keyboard.getInstance();
  this.levels = levels;
  this.levelData = this.levels.find(levelNumber);
  this.time = 0;
}

WorldScene.prototype = Object.create(Voy.Scene.prototype);

WorldScene.prototype.setup = function() {
  var world = EntityFactory.createWorld();

  var hud = EntityFactory.createHUD(this.renderer.canvas.resolution);

  var playerPosition = Voy.Point.createFromArray(this.levelData.player.position);
  this.levelName = this.levelData.name;
  this.levelNumber = this.levelData.number;
  this.player = EntityFactory.createSpaceship(playerPosition);
  world.addChild(this.player);

  if(this.levelData.rocks) {
    this.levelData.rocks.forEach(function(rockData) {
      var position = Voy.Point.createFromArray(rockData.position);
      world.addChild(EntityFactory.createRock(position));
    }.bind(this));
  }
  if(this.levelData.tide) world.addChild(EntityFactory.createTide(this.levelData.tide));

  this.levelData.walls.forEach(function(wallData) {
    var position = new Voy.Point(wallData.position[0], wallData.position[1]);
    var points = [];
    wallData.points.forEach(function(point) {
      points.push(new Voy.Point(point[0], point[1]));
    });

    var polygonType = PolygonTypeRegistry.getInstance().find(wallData.polygonTypeId);

    world.addChild(EntityFactory.createWall(position, points, polygonType));
  });

  world.addChild(EntityFactory.createGoal(Voy.Point.createFromArray(this.levelData.goal.position)));

  this.addChild(EntityFactory.createBackground());
  this.addChild(world);
  this.addChild(hud);

  this.addChild(EntityFactory.createPresenter(this.renderer.canvas.resolution));

  this.blackout = EntityFactory.createBlackout(this.renderer.canvas.resolution);
  this.addChild(this.blackout);

  Voy.Scene.prototype.setup.call(this);
};

WorldScene.prototype.initialize = function() {
  Voy.Scene.prototype.initialize.call(this);
};

WorldScene.prototype.update = function(timeDelta) {
  this.time += timeDelta;
  if(!this.outcome) {
    if(!this.playing) {
      if(this.time > 500 && this.keyboard.anyKeysPressed()) this.startPlaying();
    }
    else if(this.timer.isCompleted() || this.player.health.isDead()) {
      this.lose();
    }
  }

  Voy.Scene.prototype.update.call(this, timeDelta);

  if(this.blackout.fader.isCompleted()) this.completed = true;
};

WorldScene.prototype.startPlaying = function() {
  this.playing = true;
  this.timer.start();
};

WorldScene.prototype.stopPlaying = function() {
  this.playing = false;
  this.timer.stop();
};

WorldScene.prototype.win = function() {
  this.outcome = 'win';
  this.stopPlaying();
};

WorldScene.prototype.lose = function() {
  this.outcome = 'fail';
  this.stopPlaying();
};


function EngineRotator() {
  Voy.Component.call(this, 'engineRotator');
}

EngineRotator.prototype = Object.create(Voy.Component.prototype);

EngineRotator.prototype.update = function(timeDelta) {
  var rigidBody = this.entity.parent.rigidBody;
  var force = rigidBody.force.clone();
  var velocity = rigidBody.velocity;
  if(velocity[0] < 0) force[0] *= -1;
  if(force.getLengthSquared() > 0.00000001) {
    var ideal = Math.atan2(force[1], force[0]);
    var difference = ideal-this.entity.localRotation;
    this.entity.localRotation += difference*0.005*timeDelta;
  }
};


function Fader(initial, target) {
  this.target = target;
  this.current = initial;
  this.active = false;
  this.speed = 4;
  Voy.Component.call(this, 'fader');
}

Fader.prototype = Object.create(Voy.Component.prototype);

Fader.prototype.activate = function() {
  this.active = true;
};

Fader.prototype.deactivate = function() {
  this.active = false;
};

Fader.prototype.update = function(timeDelta) {
  if(this.active) {
    var step = this.target - this.current;
    var largestStep = timeDelta*this.speed*0.0002;
    if(Math.abs(step) > largestStep) step = largestStep*(step/Math.abs(step));
    this.current += step;
    this.current = Math.min(1, this.current);
    if(this.isCompleted()) this.deactivate();
  }
};

Fader.prototype.isCompleted = function() {
  return this.current === this.target;
};


function ReadyFader() {
  Fader.call(this, 1, 0);
  this.speed = 8;
}

ReadyFader.prototype = Object.create(Fader.prototype);

ReadyFader.prototype.initialize = function() {
  this.scene = this.getScene();
};

ReadyFader.prototype.update = function(timeDelta) {
  if(!this.active) {
    if(this.scene.playing) this.activate();
  }
  Fader.prototype.update.call(this, timeDelta);
};


function Health() {
  Voy.Component.call(this, 'health');
  this.maxPoints = 100;
  this.points = this.maxPoints;
}

Health.prototype = Object.create(Voy.Component.prototype);

Health.prototype.receiveDamage = function(points) {
  this.points -= points;
  if(this.points < 0) this.points = 0;
};

Health.prototype.getPercentage = function() {
  return this.points/this.maxPoints;
};

Health.prototype.isDead = function() {
  return this.points === 0;
};


function CollisionDamageInflictor() {
  Voy.Component.call(this, 'collisionDamageInflictor');
  this.minimumLimit = 0.15;
  this.amount = 30;
}

CollisionDamageInflictor.prototype = Object.create(Voy.Component.prototype);

CollisionDamageInflictor.prototype.initialize = function() {
  this.health = this.entity.health;
}

CollisionDamageInflictor.prototype.collided = function(collision) {
  if(collision.isPhysical() && collision.velocityAlongNormal*-1 > this.minimumLimit) {
    var otherEntity = collision.getOther(this.entity);
    var q = otherEntity.hasTag('rock') ? 0.2 : 1;
    this.health.receiveDamage(Math.round(collision.velocityAlongNormal*-this.amount*q));
  }
};


function FadingBackgroundLayer() {
  Voy.Layer.call(this, 'fadingBackgroundLayer');
}

FadingBackgroundLayer.prototype = Object.create(Voy.Layer.prototype);

FadingBackgroundLayer.prototype.initialize = function() {
  this.scene = this.getScene();
  this.size = this.scene.renderer.canvas.resolution;
  this.fader = this.entity.fader;
};

FadingBackgroundLayer.prototype.draw = function(canvas) {
  this.opacity = this.fader.current;
  canvas.drawRectangle(this.size, 'black');
};


function Thrust() {
  Voy.Component.call(this, 'thrust');
  this.booster = false;
  this.direction = Voy.Vector2.zero();
}

Thrust.prototype = Object.create(Voy.Component.prototype);

Thrust.prototype.initialize = function() {
  this.rigidBody = this.entity.rigidBody;
  this.waterResistance = this.entity.waterResistance;
};

Thrust.prototype.update = function() {
  var force = this.direction.clone();
  force.multiply(this.rigidBody.maxForce);
  if(!this.boosterOn) force.multiply(0.4);
  if(this.waterResistance.active) force.multiply(0.2);
  this.rigidBody.force.add(force);
};


function TidalForce(speed) {
  Voy.Component.call(this, 'tidalForce');
  this.speed = speed;
}

TidalForce.prototype = Object.create(Voy.Component.prototype);

TidalForce.prototype.initialize = function() {
  this.scene = this.getScene();
}

TidalForce.prototype.update = function(timeDelta) {
  if(this.speed == 0) return;
  if(this.scene.playing) this.entity.localPosition[1] -= timeDelta*0.05*this.speed;
};


function WaterLayer() {
  Voy.Layer.call(this, 'waterLayer');
}

WaterLayer.prototype = Object.create(Voy.Layer.prototype);

WaterLayer.prototype.initialize = function() {
  var scene = this.getScene();
  var image = scene.assets.images['water.png'];
  this.context = scene.renderer.canvas.context;
  this.pattern = this.context.createPattern(image, 'repeat');
};

WaterLayer.prototype.draw = function(canvas) {
  this.context.save();
  this.context.translate(-WaterLayer.width/2, -WaterLayer.height/2);
  this.context.rect(0, 0, WaterLayer.width, WaterLayer.height);
  this.context.fillStyle = this.pattern;
  this.context.fill();
  this.context.restore();
};

WaterLayer.width = 4000;
WaterLayer.height = 1120;


function WaterResistance() {
  Voy.Component.call(this, 'waterResistance');
  this.active = false;
}

WaterResistance.prototype = Object.create(Voy.Component.prototype);

WaterResistance.prototype.collided = function(collision) {
  if(this.active) return false;
  var entity = collision.getOther(this.entity);
  if(entity.hasTag('tide')) {
    this.active = true;
    this.deactivateDelay = 400;
  }
};

WaterResistance.prototype.update = function(timeDelta) {
  if(this.active) {
    this.deactivateDelay -= timeDelta;
    if(this.deactivateDelay < 0) {
      this.active = false;
    }
  }
}

function HealthCircleLayer() {
  Voy.Layer.call(this, 'fadingBackgroundLayer');
}

HealthCircleLayer.prototype = Object.create(Voy.Layer.prototype);

HealthCircleLayer.prototype.initialize = function() {
  this.health = this.getScene().findEntityWithTag('player').health;
};

HealthCircleLayer.prototype.draw = function(canvas) {
  var startAngle = (1-this.health.getPercentage())*Math.PI*2-Math.PI*0.5;
  var endAngle = Math.PI*2*0.75;

  canvas.context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  canvas.context.shadowBlur = 18;
  canvas.drawCircle(53, '#ad2b2b', Voy.Point.zero(), 0, Math.PI*2);

  canvas.context.shadowColor = 0;
  canvas.drawCircle(50, '#ad2b2b', Voy.Point.zero(), -Math.PI*0.5, startAngle);

  canvas.context.shadowColor = '#000';
  canvas.context.shadowBlur = 14;
  canvas.context.shadowOffsetX = 0;
  canvas.context.shadowOffsetY = 0;
  canvas.drawCircle(50, '#437f35', Voy.Point.zero(), startAngle, endAngle);
  
  canvas.context.shadowColor = 0;
  canvas.context.shadowBlur = 0;

  canvas.context.beginPath();
  canvas.context.strokeStyle = '#2c4e19';
  canvas.context.lineWidth = 5;
  canvas.context.arc(0, 0, 52, 0, -Math.PI*2, false);
  canvas.context.closePath();
  canvas.context.stroke();
};


function LevelProgressLayer() {
  Voy.Layer.call(this, 'levelProgressLayer');
}

LevelProgressLayer.prototype = Object.create(Voy.Layer.prototype);

LevelProgressLayer.prototype.initialize = function() {
  this.levelsCount = this.getScene().levels.count();
  this.currentLevelNumber = this.getScene().levelNumber;
  this.totaltWidth = this.levelsCount*LevelProgressLayer.iconWidth + (this.levelsCount-1)*LevelProgressLayer.padding;
};

LevelProgressLayer.prototype.draw = function(canvas) {
  var left = -this.totaltWidth/2;
  var size = new Voy.Vector2(LevelProgressLayer.iconWidth, LevelProgressLayer.iconHeight);

  for(var i=0; this.levelsCount>i; i++) {
    canvas.drawRectangle(size, '#bbb', new Voy.Point(left+LevelProgressLayer.iconWidth/2, 130));
    canvas.drawRectangle(new Voy.Vector2(size[0]-10, size[1]-10), '#000', new Voy.Point(left+LevelProgressLayer.iconWidth/2, 130));
    if(this.currentLevelNumber > i+1)
      canvas.drawRectangle(new Voy.Vector2(size[0]-20, size[1]-20), '#fff', new Voy.Point(left+LevelProgressLayer.iconWidth/2, 130));
    left += LevelProgressLayer.padding+LevelProgressLayer.iconWidth;
  }
};


LevelProgressLayer.padding = 14;
LevelProgressLayer.iconWidth = 60;
LevelProgressLayer.iconHeight = 40;


function TimeBonusLayer() {
  Voy.Layer.call(this, 'timeBonusLayer');
  this.offset = 0;
  this.time = 0;
  this.opacity = 0;
}

TimeBonusLayer.prototype = Object.create(Voy.Layer.prototype);

TimeBonusLayer.prototype.update = function(timeDelta) {
  this.time += timeDelta;
  if(this.time > 1500) {
    this.check();
    this.offset += timeDelta*0.05;

    if(this.opacity != 0) {
      this.opacity -= 0.0005*timeDelta;
      if(this.opacity < 0) this.opacity = 0;
    }
  }
};

TimeBonusLayer.prototype.check = function() {
  if(!this.checked) {
    this.opacity = 1;
    this.checked = true;
  }
};

TimeBonusLayer.prototype.draw = function(canvas) {
  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('italic 110px verdana');
  var position = new Voy.Point(0, -50-this.offset);
  canvas.text.draw("+10", position);
};


function TimeStatusLayer() {
  Voy.Layer.call(this, 'timeStatusLayer');
}

TimeStatusLayer.prototype = Object.create(Voy.Layer.prototype);

TimeStatusLayer.prototype.initialize = function() {
  this.timer = this.getScene().timer;
}

TimeStatusLayer.prototype.draw = function(canvas) {
  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('30px verdana');
  var position = new Voy.Point(0, 70);
  canvas.text.draw("Seconds left: " + Math.round(this.timer.milliSeconds/100)/10, position);
};


function LevelCompletedLayer() {
  Voy.Layer.call(this, 'levelCompletedLayer');
}

LevelCompletedLayer.prototype = Object.create(Voy.Layer.prototype);

LevelCompletedLayer.prototype.initialize = function() {
  this.levelNumber = this.getScene().levelNumber;
};

LevelCompletedLayer.prototype.draw = function(canvas) {
  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('30px verdana');
  var position = new Voy.Point(0, -70);
  canvas.text.draw("Level " + this.levelNumber + ' completed!');
};


function TimeAdder(seconds) {
  Voy.Component.call(this, 'timeAdder');
  this.time = 0;
  this.timeGiven = 0;
}

TimeAdder.prototype = Object.create(Voy.Component.prototype);

TimeAdder.prototype.initialize = function() {
  this.timer = this.getScene().timer;
};

TimeAdder.prototype.update = function(timeDelta) {
  this.time += timeDelta;
  if(this.time > 1500) {
    var timeAddition = Math.min(timeDelta*4, 10000-this.timeGiven);
    this.timeGiven += timeAddition;
    this.timer.add(timeAddition);
  }
};


function Rotation() {
  Voy.Component.call(this, 'rotation');
}

Rotation.prototype = Object.create(Voy.Component.prototype);

Rotation.prototype.update = function(timeDelta) {
  this.entity.localRotation += timeDelta*0.005;
};


function CollisionWin() {
  Voy.Component.call(this, 'collisionWin');
}

CollisionWin.prototype = Object.create(Voy.Component.prototype);

CollisionWin.prototype.initialize = function() {
  this.scene = this.getScene();
};

CollisionWin.prototype.collided = function() {
  if(!this.scene.outcome) this.scene.win();
};


function Gravity() {
  Voy.Component.call(this, 'gravity');
}

Gravity.prototype = Object.create(Voy.Component.prototype);

Gravity.prototype.initialize = function() {
  this.scene = this.getScene();
  this.rigidBody = this.entity.rigidBody;
  this.force = new Voy.Vector2(0, 0.001);
};

Gravity.prototype.update = function() {
  if(this.scene.playing) this.rigidBody.force.add(this.force);
};


function CreditsScene(timer) {
  Voy.Scene.call(this);
  this.clearColor = '#1a3a6b';
  this.timer = timer;
  this.time = 0;
}

CreditsScene.prototype = Object.create(Voy.Scene.prototype);

CreditsScene.prototype.setup = function() {
  var entity = new Voy.Entity(
    new CreditsLayer()
  );
  entity.localPosition = Voy.Vector2.multiply(this.renderer.canvas.resolution, 0.5);
  this.addChild(entity);
};

CreditsScene.prototype.update = function(timeDelta) {
  Voy.Scene.prototype.update.call(this, timeDelta);
  this.time += timeDelta;
  if(this.time > 2000 && Voy.Keyboard.getInstance().anyKeysPressed()) this.completed = true;
};


function CreditsLayer() {
  Voy.Layer.call(this, 'CreditsLayer');
}

CreditsLayer.prototype = Object.create(Voy.Layer.prototype);

CreditsLayer.prototype.initialize = function() {
  this.image = this.getScene().assets.images['happy_dog.jpg'];
  this.timer = this.getScene().timer;
};

CreditsLayer.prototype.draw = function(canvas) {
  canvas.text.color = 'white';
  canvas.text.setFont('38px verdana');
  canvas.text.setAlign('center');
  var position = new Voy.Point(0, -220);
  canvas.text.draw("Congratulations! You beat the game!", position);

  position = new Voy.Point(0, -160);
  canvas.text.draw("Smile and be happy :-)", position);

  canvas.drawImage(this.image, new Voy.Point(0, 50));

  canvas.text.setFont('20px verdana');
  canvas.text.setAlign('center');
  position = new Voy.Point(0, 262);
  canvas.text.draw("You finished the game with " + this.timer.getSeconds() + " surplus seconds. Can you beat that?", position);

};


function ReadyTextLayer() {
  Voy.Layer.call(this, 'ReadyText');
}

ReadyTextLayer.prototype = Object.create(Voy.Layer.prototype);

ReadyTextLayer.prototype.initialize = function() {
  this.scene = this.getScene();
  this.secondsLeft = this.scene.timer.getSeconds();
}

ReadyTextLayer.prototype.draw = function(canvas) {
  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('30px verdana');
  var position = new Voy.Point(0, -70);
  canvas.text.draw("Level " + this.scene.levelNumber, position);

  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('italic 64px verdana');
  canvas.text.draw(this.scene.levelName);
  
  canvas.text.color = '#fff';
  canvas.text.setAlign('center');
  canvas.text.setFont('italic 30px verdana');

  position = new Voy.Point(0, 50);
  canvas.text.draw("You have " + this.secondsLeft + " seconds.", position);
  position = new Voy.Point(0, 250);
  canvas.text.draw("Press any key to start!", position);
};


function DecidedFader() {
  Fader.call(this, 0, 1);
  this.speed = 2;
}

DecidedFader.prototype = Object.create(Fader.prototype);

DecidedFader.prototype.initialize = function() {
  this.scene = this.getScene();
};

DecidedFader.prototype.update = function(timeDelta) {
  if(!this.active) {
    if(this.scene.outcome) this.activate();
  }
  Fader.prototype.update.call(this, timeDelta);
};


function Timer(milliSeconds) {
  this.milliSeconds = milliSeconds;
  this.running = false;
}

Timer.prototype = Object.create(Voy.EventEmitter);

Timer.prototype.update = function(timeDelta) {
  if(this.running) {
    this.milliSeconds -= timeDelta;
    if(this.milliSeconds < 0) this.milliSeconds = 0;
    if(this.milliSeconds == 0) {
      this.emit('alarm');
      this.stop();
    }
  }
};

Timer.prototype.windUp = function(milliSeconds) {
  this.milliSeconds = milliSeconds;
};

Timer.prototype.stop = function() {
  this.running = false;
};

Timer.prototype.add = function(milliSeconds) {
  this.milliSeconds += milliSeconds;
};

Timer.prototype.start = function() {
  this.running = true;
};

Timer.prototype.isCompleted = function() {
  return this.milliSeconds === 0;
};

Timer.prototype.getSeconds = function() {
  return Math.floor(this.milliSeconds/1000);
};


function LevelCompletedScene(timer, levelNumber) {
  Voy.Scene.call(this);
  this.timer = timer;
  this.levelNumber = levelNumber;
  this.clearColor = 'rgb(0, 0, 0)';
  this.time = 0;
}

LevelCompletedScene.prototype = Object.create(Voy.Scene.prototype);

LevelCompletedScene.prototype.setup = function() {
  var description = new Voy.Entity(
    new LevelCompletedLayer(),
    new TimeStatusLayer()
  );
  description.localPosition = Voy.Vector2.multiply(this.renderer.canvas.resolution, 0.5);

  var timeAddition = new Voy.Entity(
    new TimeAdder(10),
    new TimeBonusLayer()
  );
  timeAddition.localPosition = Voy.Vector2.multiply(this.renderer.canvas.resolution, 0.5);

  this.addChild(description);
  this.addChild(timeAddition);
};

LevelCompletedScene.prototype.update = function(timeDelta) {
  Voy.Scene.prototype.update.call(this, timeDelta);
  this.time += timeDelta;
  if(this.time > 6000) this.completed = true;
};


function TimerLayer() {
  Voy.Layer.call(this, 'timerLayer');
}

TimerLayer.prototype = Object.create(Voy.Layer.prototype);

TimerLayer.prototype.initialize = function() {
  this.timer = this.getScene().timer;
};

TimerLayer.prototype.draw = function(canvas) {
  var secondsText = (Math.round(this.timer.milliSeconds/100)/10).toString();
  if(secondsText.length === 1) secondsText += '.0';
  canvas.text.color = 'white';
  canvas.text.setFont('italic 44px verdana');
  canvas.text.setAlign('right');
  canvas.text.draw(secondsText);
};


function LevelRegistry() { }

LevelRegistry.prototype.load = function(text) {
  this.data = JSON.parse(text);
};

LevelRegistry.prototype.find = function(id) {
  var levelData = this.data[id];
  if(!levelData) throw new Error('Could not find level.');
  return levelData;
};

LevelRegistry.prototype.count = function() {
  return Object.keys(this.data).length;
};


function FlameFlicker() {
  Voy.Component.call(this, 'flameFlicker');
  this.strengthWithoutRandom = 0;
  this.strength = 0;
  this.time = 0;
}

FlameFlicker.prototype = Object.create(Voy.Component.prototype);

FlameFlicker.prototype.initialize = function() {
  this.spaceshipBody = this.entity.parent.parent.rigidBody;
};

FlameFlicker.prototype.update = function(timeDelta) {
  var strengthTarget = this.spaceshipBody.force.getLengthSquared() === 0 ? 0 : 1;
  if(strengthTarget == this.strengthWithoutRandom) return;
  var difference = strengthTarget - this.strengthWithoutRandom;
  this.strengthWithoutRandom += difference*timeDelta*0.01;
  this.strengthWithoutRandom = this.strengthWithoutRandom.clamp(0, 1);
  this.time += timeDelta;
  var randomFactor = (Math.sin(this.time*0.02)+1)*0.25+0.5;
  this.strength = this.strengthWithoutRandom*randomFactor;
};


function LoadingScene(levels) {
  Voy.Scene.call(this);
  this.levels = levels;
}

LoadingScene.prototype = Object.create(Voy.Scene.prototype);

LoadingScene.prototype.initialize = function() {
  this.assets.on('loadingCompleted', this.complete.bind(this));

  this.assets.images.add('spaceship/hull.png');
  this.assets.images.add('spaceship/engine.png');
  this.assets.images.add('spaceship/flame.png');
  this.assets.images.add('spaceship/large_flame.png');
  this.assets.images.add('water.png');
  this.assets.images.add('happy_dog.jpg');
  this.assets.images.add('goal.png');

  this.assets.images.add('bg.jpg');

  this.assets.texts.add('levels');
};

LoadingScene.prototype.complete = function() {
  this.levels.load(this.assets.texts.levels);
  this.completed = true;
};


function SpaceshipSprite() {
  Voy.Sprite.call(this, 'spaceship/hull.png');
}

SpaceshipSprite.prototype = Object.create(Voy.Sprite.prototype);

SpaceshipSprite.prototype.draw = function(canvas) {
  if(this.entity.rigidBody.velocity[0] > 0) {
    this.flippedHorizontally = false;
  }
  else if(this.entity.rigidBody.velocity[0] < 0) {
    this.flippedHorizontally = true;
  }
  Voy.Sprite.prototype.draw.call(this, canvas);
};


function SpaceshipFlameSprite() {
  Voy.Sprite.call(this);
  this.type = 'spaceshipFlameSprite';
}

SpaceshipFlameSprite.prototype = Object.create(Voy.Sprite.prototype);

SpaceshipFlameSprite.prototype.initialize = function() {
  Voy.Sprite.prototype.initialize.call(this);
  this.flameFlicker = this.entity.flameFlicker;
  this.thrust = this.entity.parent.parent.thrust;
  this.smallFlameImage = this.getImage('spaceship/flame.png');
  this.largeFlameImage = this.getImage('spaceship/large_flame.png');
};

SpaceshipFlameSprite.prototype.draw = function(canvas) {
  if(this.thrust.boosterOn) {
    this.image = this.largeFlameImage;
    this.position = new Voy.Vector2(-80, 0);
  } else {
    this.image = this.smallFlameImage;
    this.position = new Voy.Vector2(-55, 0);
  }
  this.opacity = this.flameFlicker.strength;
  Voy.Sprite.prototype.draw.call(this, canvas);
};


(function() {
  function initialize() {
    var game = new Game();
    document.body.appendChild(game.getCanvasElement());
    game.run();
  }
  window.addEventListener('load', initialize);
})();

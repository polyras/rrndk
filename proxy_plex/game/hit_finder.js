define(['lib/blaise/vector2', 'lib/blaise/vector3', 'lib/blaise/matrix3', './transformation_helper'], function(Vector2, Vector3, Matrix3, TransformationHelper) {
  function HitFinder(eventBus, camera) {
    eventBus.subscribe('mouseDown', this.storeEvent, this);
    eventBus.subscribe('mouseUp', this.storeEvent, this);
    eventBus.subscribe('entityCreation', this.checkEntityCreation, this);
    eventBus.subscribe('entityRemoval', this.checkEntityRemoval, this);
    this.pendingEvents = [];
    this.entities = [];
    this.camera = camera;
    this.eventBus = eventBus;
  }

  HitFinder.prototype = {
    update: function() {
      this.pendingEvents.forEach(this.handleEvent.bind(this));
      this.pendingEvents.length = 0;
    },
    handleEvent: function(event) {
      switch(event.type) {
        case "mouseDown":
          this.checkPosition(event.position, 'down');
          break;
        case "mouseUp":
          this.checkPosition(event.position, 'up');
          break;
      }
    },
    checkPosition: function(position, type) {
      var worldPosition = Vector2.multiply(position, this.camera.zoom*0.5);
      var entity, entityPosition;
      for(var i=0; this.entities.length>i; i++) {
        entity = this.entities[i];
        var worldLocalMatrix = TransformationHelper.resolveInverseWorldMatrix(entity);

        worldPositionHomo = new Vector3(worldPosition.get(0), worldPosition.get(1), 1);
        var localPositionHomo = Matrix3.multiplyVector(worldLocalMatrix, worldPositionHomo);
        var localPosition = new Vector2(localPositionHomo.get(0), localPositionHomo.get(1));

        if(Math.pow(entity.aspects.hitCircle.radius, 2) >= localPosition.getSquaredLength()) {
          var event = {
            type: type + 'Hit',
            entity: entity
          };
          this.eventBus.emit(event);
        }
      }
    },
    storeEvent: function(event) {
      this.pendingEvents.push(event);
    },
    checkEntityCreation: function(entityCreationEvent) {
      var entity = entityCreationEvent.entity;
      if(entity.aspects.hitCircle) {
        this.entities.push(entity);
      }
    },
    checkEntityRemoval: function(event) {
      var entity = event.entity;
      if(entity.aspects.hitCircle) {
        var index = this.entities.indexOf(entity);
        if(index === -1) {
          throw new Error("Can't remove circle hit.");
        }
        this.entities.splice(index, 1);
      }
    }
  };

  return HitFinder;
});

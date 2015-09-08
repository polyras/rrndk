define(['lib/blaise/vector2', './transformation_helper'], function(Vector2, TransformationHelper) {
  function SteeringProcessor(eventBus) {
    eventBus.subscribe('steerStartRequest', this.handleStartEvent, this);
    eventBus.subscribe('steerStopRequest', this.handleStopEvent, this);
    this.startEvents = [];
    this.stopEvents = [];
    this.entities = [];
  }

  SteeringProcessor.prototype = {
    update: function(timeDelta) {
      this.startEvents.forEach(function(event) {
        this.entities.push(event.entity);
        event.entity.aspects.steering.target = event.target;
      }.bind(this));
      this.startEvents.length = 0;

      this.stopEvents.forEach(function(event) {
        var index = this.entities.indexOf(event.entity);
        if(index === -1) throw new Error("Can't stop steering.");
        this.entities.splice(index, 1);
        delete event.entity.aspects.steering.target;
        event.entity.aspects.seeking.active = false;
      }.bind(this));
      this.stopEvents.length = 0;

      this.entities.forEach(this.steer.bind(this));
    },
    steer: function(entity) {
      var transformationAspect = entity.aspects.transformation2D;
      var orientation = transformationAspect.orientation;
      var entityDirection = new Vector2(
        Math.cos(orientation),
        Math.sin(orientation)
      );
      var target = entity.aspects.steering.target;

      var entityWorldPosition = TransformationHelper.resolveWorldPosition(entity);
      var targetWorldPosition = TransformationHelper.resolveWorldPosition(target);

      var targetDirection = Vector2.subtract(entityWorldPosition, targetWorldPosition);
      targetDirection.normalize();

      var crossProduct = Vector2.cross(entityDirection, targetDirection);
      var rotationSpeed = 0.03;
      if(Math.abs(crossProduct) < 0.03) {
        if(!entity.aspects.seeking.active) {
          entity.aspects.seeking.target = target.aspects.transformation2D.position;
          entity.aspects.seeking.active = true;
        }
      }
      else if(crossProduct < 0) {
        transformationAspect.rotate(rotationSpeed);
      } else {
        transformationAspect.rotate(-rotationSpeed);
      }
    },
    handleStartEvent: function(startEvent) {
      this.startEvents.push(startEvent);
    },
    handleStopEvent: function(stopEvent) {
      this.stopEvents.push(stopEvent);
    }
  };

  return SteeringProcessor;
});

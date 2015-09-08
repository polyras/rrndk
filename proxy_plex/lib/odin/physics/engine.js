define(['lib/blaise/vector2'], function(Vector2) {
  function PhysicsEngine(eventBus) {
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    this.entities = [];
  }

  PhysicsEngine.prototype = {
    update: function(timeDelta) {
      this.entities.forEach(function(entity) {
        var aspects = entity.aspects;
        var transformationAspect = aspects.transformation2D;
        var rigidBodyAspect = aspects.rigidBody;
        var translation = Vector2.multiply(rigidBodyAspect.force, timeDelta);
        transformationAspect.move(translation);
        rigidBodyAspect.force.reset();
      })
    },
    handleEntityCreation: function(entityCreationEvent) {
      var entity = entityCreationEvent.entity;
      if(entity.aspects.rigidBody) {
        this.entities.push(entity);
      }
    }
  };

  return PhysicsEngine;
});

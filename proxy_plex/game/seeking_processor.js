define(['lib/blaise/vector2'], function(Vector2) {
  function SeekingProcessor(eventBus) {
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    this.entities = [];
  }

  SeekingProcessor.prototype = {
    update: function(timeDelta) {
      this.entities.forEach(function(entity) {
        var aspects = entity.aspects;
        if(!aspects.seeking.active) return;
        var direction = Vector2.subtract(aspects.seeking.target, aspects.transformation2D.position);
        var distance = direction.getLength();
        if(distance === 0) return;
        direction.normalize();
        var change = Vector2.multiply(direction, timeDelta*0.012);
        change.clamp(distance);
        aspects.transformation2D.move(change);
      });
    },
    handleEntityCreation: function(entityCreationEvent) {
      var entity = entityCreationEvent.entity;
      if(entity.aspects.seeking) {
        this.entities.push(entity);
      }
    }
  };

  return SeekingProcessor;
});

define(['./passenger_behavior', './ship_behavior'], function(PassengerBehavior, ShipBehavior) {
  function Behavior(eventBus) {
    this.eventBus = eventBus;
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    eventBus.subscribe('entityRemoval', this.handleEntityRemoval, this);
    this.behaviors = [];
  }

  Behavior.prototype = {
    update: function(timeDelta) {
      this.behaviors.forEach(function(behavior) {
        behavior.update(timeDelta);
      });
    },
    handleEntityCreation: function(entityCreationEvent) {
      var entity = entityCreationEvent.entity;
      var behavior;
      if(entity.aspects.passenger) {
        behavior = new PassengerBehavior(entity, this.eventBus);
      }
      else if(entity.aspects.ship) {
        behavior = new ShipBehavior(entity, this.eventBus);
      }
      if(behavior) this.behaviors.push(behavior);
    },
    handleEntityRemoval: function(event) {
      var entity = event.entity;
      if(entity.aspects.passenger) {
        for(var i=0; this.behaviors.length>i; i++) {
          if(this.behaviors[i].passenger === entity) break;
        }
        if(i === this.behaviors.length) throw new Error("Could not find passenger behavior.");
        var behavior = this.behaviors[i];
        behavior.shutdown();
        this.behaviors.splice(i, 1);
      }
    }
  };

  return Behavior;
});

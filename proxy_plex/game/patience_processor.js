define(function() {
  function PatienceProcessor(eventBus) {
    this.eventBus = eventBus;
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    eventBus.subscribe('entityRemoval', this.handleEntityCreation, this);
    this.entities = [];
  }

  PatienceProcessor.prototype = {
    update: function(timeDelta) {
      this.entities.forEach(function(entity) {
        if(entity.aspects.passenger.isArrived) return;
        entity.aspects.passenger.patience -= timeDelta*0.00001;
        entity.aspects.passenger.patience = Math.max(0, entity.aspects.passenger.patience);
        if(entity.aspects.passenger.patience === 0 && !this.emittedLossEvent) {
          this.emittedLossEvent = true;
          this.eventBus.emit({ type: 'loss' });
        }
      }.bind(this));
    },
    handleEntityCreation: function(event) {
      var entity = event.entity;
      if(entity.aspects.passenger) {
        this.entities.push(entity);
      }
    },
    handleEntityRemoval: function(event) {
      var entity = event.entity;
      if(entity.aspects.passenger) {
        var index = this.entities.indexOf(entity);
        if(index === -1) throw new Error("Can't remove entity from patience processor.");
        this.entities.splice(index, 1);
      }
    }
  };

  return PatienceProcessor;
});

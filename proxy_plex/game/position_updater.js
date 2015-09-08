define(function() {
  function PositionUpdater(eventBus) {
    eventBus.subscribe('positionUpdateRequest', this.storeEvent, this);
    this.pendingEvents = [];
  }

  PositionUpdater.prototype = {
    update: function() {
      this.pendingEvents.forEach(function(event) {
        event.entity.aspects.transformation2D.position = event.position;
      });
      this.pendingEvents.length = [];
    },
    storeEvent: function(event) {
      this.pendingEvents.push(event);
    }
  };

  return PositionUpdater;
});

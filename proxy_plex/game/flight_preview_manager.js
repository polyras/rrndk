define(function() {
  function FlightPreviewManager(eventBus, creator) {
    eventBus.subscribe('flightPreviewUpdate', this.storeEvent, this);
    eventBus.subscribe('flightPreviewEnd', this.storeEvent, this);
    this.pendingEvents = [];
    this.creator = creator;
  }

  FlightPreviewManager.prototype = {
    update: function() {
      this.pendingEvents.forEach(function(event) {
        if(event.type == 'flightPreviewUpdate') {
          if(!this.preview) {
            this.preview = this.creator.createFlightPreview(event.ship, event.target);
          } else {
            this.preview.aspects.flightPreview.target = event.target;
          }
        } else {
          this.preview.remove();
          delete this.preview;
        }
      }.bind(this));
      this.pendingEvents.length = 0;
    },
    storeEvent: function(event) {
      this.pendingEvents.push(event);
    }
  };

  return FlightPreviewManager;
});

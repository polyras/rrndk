define(function() {
  function WinMonitor(eventBus) {
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    eventBus.subscribe('passengerGoodbye', this.handleGoodbye, this);
    this.remainingPassengersCount = 0;
    this.eventBus = eventBus;
  }

  WinMonitor.prototype = {
    handleEntityCreation: function(event) {
      var entity = event.entity;
      if(entity.aspects.planet) {
        this.remainingPassengersCount += entity.aspects.planet.passengerCount;
      }
    },
    update: function() {
      if(this.remainingPassengersCount === 0 && !this.emitted) {
        this.emitted = true;
        this.eventBus.emit({ type: 'win' });
      }
    },
    handleGoodbye: function() {
      this.remainingPassengersCount--;
    }
  };

  return WinMonitor;
});

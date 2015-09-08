define(function() {
  function DockingRegistry(eventBus) {
    this.eventBus = eventBus;
    eventBus.subscribe('takeoff', this.handleTakeoff, this);
    eventBus.subscribe('dockingRequest', this.handleDockingRequest, this);
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);

    this.planets = [];
  }

  DockingRegistry.prototype = {
    bind: function(ship, planet) {
      planet.aspects.planet.ship = ship;
      ship.aspects.ship.planet = planet;
    },
    unbind: function(ship) {
      var planet = ship.aspects.ship.planet;
      if(!planet) throw new Error("Ship has not planet.");
      delete planet.aspects.planet.ship;
      delete ship.aspects.ship.planet;
    },
    update: function() {
      this.planets.forEach(function(planet) {
        var aspect = planet.aspects.planet;
        if(aspect.waitingList.length !== 0 && !aspect.ship) {
          var ship = aspect.waitingList.shift();
          this.bind(ship, planet);

          var event = {
            type: 'dockingConfirmation',
            ship: ship
          };
          this.eventBus.emit(event);
        }
      }.bind(this));
    },
    handleTakeoff: function(event) {
      this.unbind(event.ship);
    },
    handleDockingRequest: function(event) {
      event.planet.aspects.planet.waitingList.push(event.ship);
    },
    handleEntityCreation: function(event) {
      var entity = event.entity;
      if(entity.aspects.planet) {
        this.planets.push(entity);
      }
    }
  };

  return DockingRegistry;
});

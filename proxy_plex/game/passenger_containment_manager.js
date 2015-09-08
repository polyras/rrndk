define(function() {
  function PassengerContainmentManager(eventBus) {
    this.eventBus = eventBus;
    eventBus.subscribe('passengerContainerChangeRequest', this.storeRequest, this);
    eventBus.subscribe('passengerContainerRemovalRequest', this.storeRequest, this);
    this.pendingRequestEvents = [];
  }

  PassengerContainmentManager.prototype = {
    insert: function(passenger, container, eventBus) {
      container.aspects.passengerContainer.list.push(passenger);
      passenger.aspects.passenger.container = container;

      var event = {
        type: 'passengerContainerInsertion',
        passenger: passenger,
        container: container
      };
      this.eventBus.emit(event);
    },
    remove: function(passenger) {
      var container = passenger.aspects.passenger.container;
      if(!container) throw new Error("Could not unbind because passenger has no container.");
      var list = container.aspects.passengerContainer.list;
      var index = list.indexOf(passenger);
      if(index === -1) throw new Error("Could not unbind because container doesn't have passenger.");
      list.splice(index, 1);
      delete passenger.aspects.passenger.container;

      var event = {
        type: 'passengerContainerRemoval',
        container: container,
        passenger: passenger
      };
      this.eventBus.emit(event);
    },
    update: function() {
      this.pendingRequestEvents.forEach(function(event) {
        this.remove(event.passenger);
        if(event.type === "passengerContainerChangeRequest") {
          this.insert(event.passenger, event.newContainer);
        }
      }.bind(this));
      this.pendingRequestEvents.length = 0;
    },
    storeRequest: function(requestEvent) {
      this.pendingRequestEvents.push(requestEvent);
    }
  };

  return PassengerContainmentManager;
});

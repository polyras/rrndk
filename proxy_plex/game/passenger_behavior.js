define(['lib/blaise/vector2'], function(Vector2) {
  function WaitState(passenger, eventBus, behavior) {
    this.passenger = passenger;
    this.behavior = behavior;
    this.eventBus = eventBus;
    this.planet = this.passenger.aspects.passenger.container;

    eventBus.subscribe('passengerContainerInsertion', this.handleContainerInsertion, this);
    eventBus.subscribe('passengerContainerRemoval', this.handleContainerRemoval, this);
    this.shouldTransition = false;
  }

  WaitState.prototype = {
    enter: function() {
      this.updateSeekingTarget();
    },
    updateSeekingTarget: function() {
      var aspects = this.passenger.aspects;
      var list = this.planet.aspects.passengerContainer.list;
      var passengersCount = list.length;
      if(passengersCount == 1) {
        aspects.seeking.target = new Vector2(0, this.planet.aspects.planet.radius);
      } else {
        var slotIndex = list.indexOf(this.passenger);
        var x = Math.cos(Math.PI*0.5-(slotIndex/passengersCount)*Math.PI*2);
        var y = Math.sin(Math.PI*0.5-(slotIndex/passengersCount)*Math.PI*2);
        var direction = new Vector2(x, y);
        var position = Vector2.multiply(direction, this.planet.aspects.planet.radius);
        aspects.seeking.target = position;
      }
    },
    update: function() {
      if(this.shouldTransition) {
        var newState = new BoardingState(this.passenger, this.eventBus, this.behavior);
        this.behavior.changeState(newState);
      }
      if(this.shouldUpdateSeekingTarget) {
        this.updateSeekingTarget();
        this.shouldUpdateSeekingTarget = false;
      }
    },
    exit: function() {
      this.eventBus.unsubscribe('passengerContainerRemoval', this.handleContainerRemoval, this);
      this.eventBus.unsubscribe('passengerContainerInsertion', this.handleContainerInsertion, this);
    },
    handleContainerRemoval: function(event) {
      if(event.container === this.planet) {
        this.shouldUpdateSeekingTarget = true;
      }
    },
    handleContainerInsertion: function(event) {
      if(this.passenger === event.passenger) {
        this.shouldTransition = true;
      } else {
        if(event.container === this.planet) {
          this.shouldUpdateSeekingTarget = true;
        }
      }
    }
  };

  function GoodByeState(passenger, eventBus) {
    this.passenger = passenger;
    this.eventBus = eventBus;
  }

  GoodByeState.prototype = {
    enter: function() {
      this.eventBus.emit({ type: 'passengerGoodbye' });
    },
    update: function(timeDelta) {
      var transformationAspect = this.passenger.aspects.transformation2D;
      transformationAspect.scale(-0.001*timeDelta);
      if(transformationAspect._scale === 0) {
        this.passenger.remove();
      }
    },
    exit: function() {}
  };

  function FlightState(passenger, eventBus, behavior) {
    this.passenger = passenger;
    this.eventBus = eventBus;
    this.behavior = behavior;
  }

  FlightState.prototype = {
    enter: function() {
      this.eventBus.subscribe('parkingCompletion', this.handleParkingCompletion, this);
    },
    update: function() {
      if(this.isLanded) {
        var nextState;
        if(this.passenger.aspects.passenger.destination === this.passenger.aspects.passenger.container.aspects.ship.planet) {
          nextState = new GoodByeState(this.passenger, this.eventBus);

          var containerEvent = {
            type: 'passengerContainerRemovalRequest',
            passenger: this.passenger
          };
          this.eventBus.emit(containerEvent);

          this.passenger.aspects.passenger.isArrived = true;
        } else {
          nextState = new BoardingState(this.passenger, this.eventBus, this.behavior);
        }
        this.behavior.changeState(nextState);
      }
    },
    exit: function() {
      this.eventBus.unsubscribe('parkingCompletion', this.handleParkingCompletion, this);
    },
    handleParkingCompletion: function(event) {
      if(event.ship === this.passenger.aspects.passenger.container) {
        this.isLanded = true;
      }
    }
  };

  function BoardingState(passenger, eventBus, behavior) {
    this.passenger = passenger;
    this.eventBus = eventBus;
    this.behavior = behavior;
    this.ship = passenger.aspects.passenger.container;
    eventBus.subscribe('passengerContainerInsertion', this.handleContainerInsertion, this);
    eventBus.subscribe('passengerContainerRemoval', this.handleContainerRemoval, this);
    eventBus.subscribe('takeoff', this.handleTakeoff, this);
  }

  BoardingState.prototype = {
    enter: function() {
      this.updateSeekingTarget();
    },
    updateSeekingTarget: function() {
      var ship = this.passenger.aspects.passenger.container;
      var aspects = this.passenger.aspects;
      var list = ship.aspects.passengerContainer.list;
      var passengersCount = list.length;
      if(passengersCount == 1) {
        aspects.seeking.target = Vector2.zero();
      } else {
        var slotIndex = list.indexOf(this.passenger);
        var x = Math.cos((slotIndex/passengersCount)*Math.PI*2);
        var y = Math.sin((slotIndex/passengersCount)*Math.PI*2);
        aspects.seeking.target = new Vector2(x, y);
      }
    },
    update: function() {
      if(this.shouldTransition) {
        var newState = new WaitState(this.passenger, this.eventBus, this.behavior);
        this.behavior.changeState(newState);
      }
      else if(this.takenOff) {
        var newState = new FlightState(this.passenger, this.eventBus, this.behavior);
        this.behavior.changeState(newState);
      }
      if(this.shouldUpdateSeekingTarget) {
        this.updateSeekingTarget();
        this.shouldUpdateSeekingTarget = false;
      }
    },
    exit: function() {
      this.eventBus.unsubscribe('passengerContainerInsertion', this.handleContainerInsertion, this);
      this.eventBus.unsubscribe('passengerContainerRemoval', this.handleContainerRemoval, this);
      this.eventBus.unsubscribe('takeoff', this.handleTakeoff, this);
    },
    handleContainerInsertion: function(event) {
      if(event.passenger === this.passenger) {
        this.shouldTransition = true;
      }
      else if(event.passenger.aspects.passenger.container === this.passenger.aspects.passenger.container) {
        this.shouldUpdateSeekingTarget = true;
      }
    },
    handleTakeoff: function() {
      this.takenOff = true;
    },
    handleContainerRemoval: function(event) {
      if(event.container === this.ship) {
        this.shouldUpdateSeekingTarget = true;
      }
    }
  };


  function PassengerBehavior(passenger, eventBus) {
    this.state = new WaitState(passenger, eventBus, this);
    this.state.enter();
    this.passenger = passenger;
  }

  PassengerBehavior.prototype = {
    update: function(timeDelta) {
      if(this.pendingState) {
        this.state.exit();
        this.state = this.pendingState;
        this.state.enter();
        delete this.pendingState;
      }
      this.state.update(timeDelta);
    },
    changeState: function(newState) {
      this.pendingState = newState;
    },
    shutdown: function() {
      this.state.exit();
    }
  };

  return PassengerBehavior;
});

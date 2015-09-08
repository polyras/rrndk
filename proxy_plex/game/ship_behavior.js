define(['lib/blaise/vector2', './transformation_helper'], function(Vector2, TransformationHelper) {
  var standbyDistance = 12;
  var squaredStandbyDistance = Math.pow(standbyDistance, 2);
  var parkDistance = 0.1;
  var squaredParkDistance = Math.pow(parkDistance, 2);

  function ParkState(ship, eventBus, behavior, destination) {
    this.ship = ship;
    this.eventBus = eventBus;
    this.behavior = behavior;
    this.destination = destination;
  }

  ParkState.prototype = {
    enter: function() { },
    update: function() {
      var transformationAspect = this.ship.aspects.transformation2D;
      var orientation = transformationAspect.orientation;
      var entityDirection = new Vector2(
        Math.cos(orientation),
        Math.sin(orientation)
      );
      var targetDirection = new Vector2(0, 1);

      var crossProduct = Vector2.cross(targetDirection, entityDirection);
      var rotationSpeed = 0.03;
      if(Math.abs(crossProduct) < 0.03) {
        var newState = new GroundedState(this.ship, this.eventBus, this.behavior);
        this.behavior.changeState(newState);

        var event = {
          type: 'parentSetRequest',
          entity: this.ship,
          parent: this.destination
        };
        this.eventBus.emit(event);

        var event = {
          type: 'parkingCompletion',
          ship: this.ship
        };
        this.eventBus.emit(event);
      }
      else if(crossProduct < 0) {
        transformationAspect.rotate(rotationSpeed);
      } else {
        transformationAspect.rotate(-rotationSpeed);
      }
    },
    exit: function() { }
  };

  function LandState(ship, eventBus, behavior, destination) {
    this.ship = ship;
    this.eventBus = eventBus;
    this.behavior = behavior;
    this.destination = destination;
  }

  LandState.prototype = {
    enter: function() {
      var steerEvent = {
        type: 'steerStartRequest',
        entity: this.ship,
        target: this.destination
      };
      this.eventBus.emit(steerEvent);
    },
    update: function() {
      var worldPosition = TransformationHelper.resolveWorldPosition(this.ship);
      var difference = Vector2.subtract(worldPosition, this.destination.aspects.transformation2D.position);
      var squaredDistance = difference.getSquaredLength();
      if(squaredParkDistance >= squaredDistance) {
        var newState = new ParkState(this.ship, this.eventBus, this.behavior, this.destination);
        this.behavior.changeState(newState);
      }
    },
    exit: function() {
      var steerEvent = {
        type: 'steerStopRequest',
        entity: this.ship,
        target: this.destination
      };
      this.eventBus.emit(steerEvent);
    }
  };

  function StandbyState(ship, eventBus, behavior, destination) {
    this.eventBus = eventBus;
    this.ship = ship;
    this.behavior = behavior;
    eventBus.subscribe('dockingConfirmation', this.checkDockingEvent, this);
    this.destination = destination;
  }

  StandbyState.prototype = {
    enter: function() {
      var steerEvent = {
        type: 'steerStopRequest',
        entity: this.ship,
        target: this.destination
      };
      this.eventBus.emit(steerEvent);

      var dockingEvent = {
        type: 'dockingRequest',
        ship: this.ship,
        planet: this.destination
      };
      this.eventBus.emit(dockingEvent);
    },
    update: function() {
      if(this.shouldTransition) {
        var newState = new LandState(this.ship, this.eventBus, this.behavior, this.destination);
        this.behavior.changeState(newState);
      }
    },
    exit: function() {
      this.eventBus.unsubscribe('dockingConfirmation', this.checkDockingEvent, this);
    },
    checkDockingEvent: function(event) {
      if(event.ship === this.ship) {
        this.shouldTransition = true;
      }
    }
  };

  function FlightState(ship, eventBus, behavior, destination) {
    this.ship = ship;
    this.eventBus = eventBus;
    this.behavior = behavior;
    this.destination = destination;
  }

  FlightState.prototype = {
    enter: function() {
      var steerEvent = {
        type: 'steerStartRequest',
        entity: this.ship,
        target: this.destination
      };
      this.eventBus.emit(steerEvent);

      var parentEvent = {
        type: 'parentUnsetRequest',
        entity: this.ship
      };
      this.eventBus.emit(parentEvent);

      var takeoffEvent = {
        type: 'takeoff',
        ship: this.ship
      };
      this.eventBus.emit(takeoffEvent);
    },
    update: function() {
      var worldPosition = TransformationHelper.resolveWorldPosition(this.ship);
      var difference = Vector2.subtract(worldPosition, this.destination.aspects.transformation2D.position);
      var squaredDistance = difference.getSquaredLength();
      if(squaredStandbyDistance >= squaredDistance) {
        var newState = new StandbyState(this.ship, this.eventBus, this.behavior, this.destination);
        this.behavior.changeState(newState);
      }
    },
    exit: function() { }
  };

  function GroundedState(ship, eventBus, behavior) {
    this.ship = ship;
    this.eventBus = eventBus;
    this.behavior = behavior;
    eventBus.subscribe('flightRequest', this.storeFlightRequestEvent, this);
  }

  GroundedState.prototype = {
    enter: function() { },
    update: function() {
      if(this.flightRequestEvent) {
        var nextState = new FlightState(this.ship, this.eventBus, this.behavior, this.flightRequestEvent.destination);
        this.behavior.changeState(nextState);
      }
    },
    exit: function() {
      this.eventBus.unsubscribe('flightRequest', this.storeFlightRequestEvent, this);
    },
    storeFlightRequestEvent: function(event) {
      if(event.ship === this.ship)
        this.flightRequestEvent = event;
    }
  };

  function ShipBehavior(ship, eventBus) {
    this.ship = ship;
    this.eventBus = eventBus;
    this.state = new GroundedState(ship, eventBus, this);
  }

  ShipBehavior.prototype = {
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
    }
  };

  return ShipBehavior;
});

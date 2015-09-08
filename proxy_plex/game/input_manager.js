define(['lib/blaise/vector2'], function(Vector2, PassengerContainment) {
  function InputManager(eventBus, mouse, camera, passengerContainmentManager) {
    this.mouse = mouse;
    this.camera = camera;
    this.pendingHitEvents = [];
    this.pendingMouseEvents = [];
    this.passengerContainmentManager = passengerContainmentManager;
    eventBus.subscribe('downHit', this.storeHitEvent, this);
    eventBus.subscribe('upHit', this.storeHitEvent, this);
    eventBus.subscribe('mouseUp', this.storeMouseEvent, this);
    eventBus.subscribe('mouseMove', this.storeMouseEvent, this);
    this.eventBus = eventBus;
  }

  InputManager.prototype = {
    update: function() {
      var event;
      for(var i=0; this.pendingHitEvents.length>i; i++) {
        event = this.pendingHitEvents[i];
        switch(event.type) {
          case "upHit":
            this.processUpHitEvent(event);
            break;
          case "downHit":
            this.processDownHitEvent(event);
            break;
          default:
            throw new Error("Can't handle event type.");
            break;
        }
      }
      this.pendingHitEvents.length = 0;

      for(var i=0; this.pendingMouseEvents.length>i; i++) {
        event = this.pendingMouseEvents[i];
        switch(event.type) {
          case "mouseUp":
            this.processMouseUpEvent(event);
            break;
          case "mouseMove":
            this.processMouseMoveEvent(event);
            break;
          default:
            throw new Error("Can't handle event type.");
            break;
        }
      }
      this.pendingMouseEvents.length = 0;
    },
    processDownHitEvent: function(event) {
      if(event.entity.aspects.passenger && !this.pressedPassenger) {
        this.pressedPassenger = event.entity;
      }
      else if(event.entity.aspects.ship) {
        this.pressedShip = event.entity;
      }
    },
    processUpHitEvent: function(event) {
      if(this.pressedShip && this.isDraggingShip && event.entity.aspects.planet && event.entity !== this.pressedShip.aspects.ship.planet) {
        var event = {
          type: 'flightRequest',
          ship: this.pressedShip,
          destination: event.entity
        };
        this.eventBus.emit(event);
      }
      else if(this.pressedPassenger) {
        var passengerContainer = this.pressedPassenger.aspects.passenger.container;
        if(passengerContainer) {
          if(passengerContainer.aspects.planet && event.entity === passengerContainer.aspects.planet.ship && passengerContainer.aspects.planet.ship.aspects.passengerContainer.list.length != 5) {
            var containerEvent = {
              type: 'passengerContainerChangeRequest',
              passenger: this.pressedPassenger,
              newContainer: event.entity
            };
            this.eventBus.emit(containerEvent);

            this.draggingPassengerMovedToShip = true;
            var parentEvent = {
              type: 'parentSetRequest',
              entity: this.pressedPassenger,
              parent: event.entity
            };
            this.eventBus.emit(parentEvent);
          }
          else if(event.entity === this.pressedPassenger) {
            var container = this.pressedPassenger.aspects.passenger.container;
            if(container.aspects.ship) {
              var containerEvent = {
                type: 'passengerContainerChangeRequest',
                passenger: event.entity,
                newContainer: container.aspects.ship.planet
              };
              this.eventBus.emit(containerEvent);

              var parentEvent = {
                type: 'parentSetRequest',
                entity: this.pressedPassenger,
                parent: container.aspects.ship.planet
              };
              this.eventBus.emit(parentEvent);
            }
          }
        }
      }
    },
    processMouseMoveEvent: function(event) {
      if(this.mouse.isDragging) {
        if(this.pressedShip) {
          var worldPosition = Vector2.multiply(this.mouse.position, this.camera.zoom*0.5);
          var event = {
            type: 'flightPreviewUpdate',
            ship: this.pressedShip,
            target: worldPosition
          };
          this.eventBus.emit(event);
          this.isDraggingShip = true;
        }
        else if(this.pressedPassenger) {
          if(!this.isDraggingPassenger) {
            this.isDraggingPassenger = true;

            this.priorPassengerParent = this.pressedPassenger.aspects.parenting.parent;
            this.pressedPassenger.aspects.seeking.active = false;
            var parentEvent = {
              type: 'parentUnsetRequest',
              entity: this.pressedPassenger
            };
            this.eventBus.emit(parentEvent);
          }

          var worldPosition = Vector2.multiply(this.mouse.position, this.camera.zoom*0.5);
          this.eventBus.emit({
            type: 'positionUpdateRequest',
            entity: this.pressedPassenger,
            position: worldPosition
          });
        }
      }
    },
    processMouseUpEvent: function(event) {
      if(this.pressedShip) {
        delete this.pressedShip;
        if(this.isDraggingShip) {
          this.isDraggingShip = false;
          this.eventBus.emit({ type: 'flightPreviewEnd' });
        }
      }
      if(this.pressedPassenger) {
        if(this.isDraggingPassenger) {
          this.isDraggingPassenger = false;
          this.pressedPassenger.aspects.seeking.active = true;

          if(!this.draggingPassengerMovedToShip) {
            var parentEvent = {
              type: 'parentSetRequest',
              entity: this.pressedPassenger,
              parent: this.priorPassengerParent
            };
            this.eventBus.emit(parentEvent);
            delete this.draggingPassengerMovedToShip;
          }
        }

        delete this.priorPassengerParent;
        delete this.pressedPassenger;
        delete this.draggingPassengerMovedToShip;
      }
    },
    storeMouseEvent: function(event) {
      this.pendingMouseEvents.push(event);
    },
    storeHitEvent: function(event) {
      this.pendingHitEvents.push(event);
    }
  }

  return InputManager;
});

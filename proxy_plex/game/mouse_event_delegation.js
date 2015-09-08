define(function() {
  function MouseEventDelegation(systemEventBus, localEventBus) {
    systemEventBus.subscribe('mouseMove', this.handleMouseMove, this);
    systemEventBus.subscribe('mouseUp', this.handleMouseUp, this);
    systemEventBus.subscribe('mouseDown', this.handleMouseDown, this);
    this.systemEventBus = systemEventBus;
    this.localEventBus = localEventBus;
  }

  MouseEventDelegation.prototype = {
    shutdown: function() {
      this.systemEventBus.unsubscribe('mouseMove', this.handleMouseMove, this);
      this.systemEventBus.unsubscribe('mouseUp', this.handleMouseUp, this);
      this.systemEventBus.unsubscribe('mouseDown', this.handleMouseDown, this);
    },
    handleMouseMove: function(event) {
      this.localEventBus.emit(event);
    },
    handleMouseUp: function(event) {
      this.localEventBus.emit(event);
    },
    handleMouseDown: function(event) {
      this.localEventBus.emit(event);
    }
  };

  return MouseEventDelegation;
});

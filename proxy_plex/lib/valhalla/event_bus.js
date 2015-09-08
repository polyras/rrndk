define(['lib/valhalla/signal'], function(Signal) {
  function EventBus() {
    this.signals = {};
  }

  EventBus.prototype = {
    subscribe: function(type, _function, context) {
      var signal = this.getSignal(type);
      signal.subscribe(_function, context);
    },
    unsubscribe: function(type, _function, context) {
      var signal = this.getSignal(type);
      signal.unsubscribe(_function, context);
    },
    emit: function(event) {
      var signal = this.getSignal(event.type);
      signal.emit(event);
    },
    getSignal: function(type) {
      if(!this.signals[type]) {
        this.signals[type] = new Signal(type);
      }
      return this.signals[type];
    }
  };

  return EventBus;
});

define(function() {
  function Signal() {
    this.callbacks = [];
  }

  Signal.prototype = {
    subscribe: function(_function, context) {
      var callback = {
        _function: _function,
        context: context
      };
      this.callbacks.push(callback);
    },
    unsubscribe: function(_function, context) {
      var callback;
      var index;
      for(var i=0; this.callbacks.length>i; i++) {
        callback = this.callbacks[i];
        if(callback._function === _function && callback.context === context) {
          index = i;
          break;
        }
      }
      if(typeof(index) === "undefined") throw new Error("Could not unsubscribe.");
      this.callbacks.splice(index, 1);
    },
    emit: function(event) {
      this.callbacks.forEach(function(callback) {
        callback._function.call(callback.context, event);
      });
    }
  };

  return Signal;
});

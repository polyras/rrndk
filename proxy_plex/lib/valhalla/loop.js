define(function() {
  function Loop(delegate) {
    this.delegate = delegate;
  }

  Loop.prototype = {
    start: function() {
      this.scheduleNextTick();
    },
    tick: function(timestamp) {
      var timeDelta = 0;
      if(this.lastTimestamp) {
        timeDelta = timestamp - this.lastTimestamp;
      }
      this.lastTimestamp = timestamp;
      if(timeDelta < 100) this.delegate.update(timeDelta);
      this.scheduleNextTick();
    },
    scheduleNextTick: function() {
      requestAnimationFrame(this.tick.bind(this));
    }
  };

  return Loop;
});

define(function() {
  var PlayState;
  require(['game/play_state'], function(x) {
    PlayState = x;
  })

  function WinState(system, levelCount) {
    this.levelCount = levelCount;
    system.eventBus.subscribe('mouseUp', this.handleMouseUp, this);
    this.system = system;
  }

  WinState.prototype = {
    update: function(timeDelta) {
      if(this.shouldTransition) {
        var state = new PlayState(this.system, this.levelCount+1);
        var event = {
          type: 'stateChangeRequest',
          state: state
        };
        this.system.eventBus.emit(event);
      }
    },
    enter: function() {
      var context = this.system.canvasElement.getContext('2d');

      context.fillStyle = '#fff';
      context.fillRect(-this.system.canvasElement.width*0.5, -this.system.canvasElement.height*0.5, this.system.canvasElement.width, this.system.canvasElement.height);

      context.textAlign = 'center';
      context.fillStyle = '#555';
      context.font = '50pt times new roman';
      context.fillText("You beat level " + this.levelCount, 0, -20);

      context.font = '20pt times new roman';
      context.fillText("Ready for the next one?", 0, 25);
    },
    exit: function() {
      this.system.eventBus.unsubscribe('mouseUp', this.handleMouseUp, this);
    },
    handleMouseUp: function() {
      this.shouldTransition = true;
    }
  };

  return WinState;
});

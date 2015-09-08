define(['./play_state'], function(PlayState) {
  function WelcomeState(system) {
    system.eventBus.subscribe('mouseUp', this.handleMouseUp, this);
    this.system = system;
  }

  WelcomeState.prototype = {
    update: function(timeDelta) {
      if(this.shouldTransition) {
        var playState = new PlayState(this.system, 1);
        var event = {
          type: 'stateChangeRequest',
          state: playState
        };
        this.system.eventBus.emit(event);
      }
    },
    enter: function() {
      var context = this.system.canvasElement.getContext('2d');

      context.fillStyle = '#fff';
      context.fillRect(-this.system.canvasElement.width*0.5, -this.system.canvasElement.height*0.5, this.system.canvasElement.width, this.system.canvasElement.height);

      context.textAlign = 'center';
      context.font = '40pt times new roman';
      context.fillStyle = '#555';
      context.fillText("Proxy Plex", 0, 150);

      context.fillStyle = '#2b74cf';
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, 100, Math.PI*1.5, Math.PI*2);
      context.lineTo(0, 0);
      context.fill();

      context.fillStyle = '#c54a4a';
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, 100, Math.PI, Math.PI*1.5);
      context.lineTo(0, 0);
      context.fill();

      context.fillStyle = '#65b55b';
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, 100, 0, Math.PI*0.5);
      context.lineTo(0, 0);
      context.fill();

      context.fillStyle = '#f0b028';
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, 100, Math.PI*0.5, Math.PI);
      context.lineTo(0, 0);
      context.fill();
    },
    exit: function() {
      this.system.eventBus.unsubscribe('mouseUp', this.handleMouseUp, this);
    },
    handleMouseUp: function() {
      this.shouldTransition = true;
    }
  };

  return WelcomeState;
});

define(['lib/valhalla/loop', 'lib/valhalla/event_bus', './welcome_state', 'lib/valhalla/mouse'], function(Loop, EventBus, WelcomeState, Mouse) {
  function Game(window) {
    this.setupCanvas(window);
    var eventBus = new EventBus();
    var mouse = new Mouse(window, this.canvasElement, eventBus);
    var system = {
      mouse: mouse,
      eventBus: eventBus,
      canvasElement: this.canvasElement,
      window: window
    };

    eventBus.subscribe('stateChangeRequest', this.handleStateChange, this);

    this.state = new WelcomeState(system);
    this.state.enter();
    this.loop = new Loop(this);
  }

  Game.prototype = {
    setupCanvas: function(window) {
      var canvas = window.document.createElement('canvas');
      canvas.width = 960*window.devicePixelRatio;
      canvas.height = 560*window.devicePixelRatio;
      canvas.style.width = (canvas.width/window.devicePixelRatio) + 'px';
      canvas.style.height = (canvas.height/window.devicePixelRatio) + 'px';
      var context = canvas.getContext('2d');
      context.translate(canvas.width*0.5, canvas.height*0.5);
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.canvasElement = canvas;
    },
    run: function() {
      this.loop.start();
    },
    update: function(timeDelta) {
      if(this.pendingState) {
        this.state.exit();
        this.state = this.pendingState;
        delete this.pendingState;
        this.state.enter();
      }
      this.state.update(timeDelta);
    },
    handleStateChange: function(event) {
      this.pendingState = event.state;
    }
  };

  return Game;
});

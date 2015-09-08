define(['lib/blaise/vector2'], function(Vector2) {
  var dragTolerance = 0.04;
  var dragToleranceSquared = Math.pow(dragTolerance, 2);

  function Mouse(window, canvasElement, eventBus) {
    this.window = window;
    this.document = window.document;
    this.canvasElement = canvasElement;
    this.moveHandler = this.handleMove.bind(this);
    this.downHandler = this.handleDown.bind(this);
    this.upHandler = this.handleUp.bind(this);
    this.resume();
    this.eventBus = eventBus;
    this.isDragging = false;
    this.isPressed = false;
  }

  Mouse.prototype = {
    resume: function() {
      this.document.addEventListener('mousemove', this.moveHandler);
      this.canvasElement.addEventListener('mousedown', this.downHandler);
      this.canvasElement.addEventListener('mouseup', this.upHandler);
    },
    handleMove: function(event) {
      var position = this.calculatePosition(event);

      if(!this.isDragging && this.isPressed) {
        var squaredDistance = Vector2.subtract(position, this.lastMouseDownPosition).getSquaredLength();
        if(squaredDistance >= dragToleranceSquared) {
          this.isDragging = true;
        }
      }

      this.position = position;

      var event = {
        type: 'mouseMove',
        position: position
      };
      this.eventBus.emit(event);
    },
    handleDown: function(event) {
      this.isPressed = true;
      var position = this.calculatePosition(event);
      this.lastMouseDownPosition = position;
      var event = {
        type: 'mouseDown',
        position: position
      };

      this.position = position;

      this.eventBus.emit(event);
    },
    handleUp: function(event) {
      var position = this.calculatePosition(event);
      this.position = position;
      this.isPressed = false;
      this.isDragging = false;
      var event = { type: 'mouseUp', position: position };
      this.eventBus.emit(event);
    },
    calculatePosition: function(event) {
      var aspectRatio = this.canvasElement.width/this.canvasElement.height;

      var left = event.pageX-this.canvasElement.offsetLeft;
      var width = this.canvasElement.width/this.window.devicePixelRatio;
      var x = ((left/width)*2-1)*aspectRatio;

      var top = event.pageY-this.canvasElement.offsetTop;
      var height = this.canvasElement.height/this.window.devicePixelRatio;
      var y = ((top/height)*2-1)*-1;

      var position = new Vector2(x, y);
      return position;
    }
  };

  return Mouse;
});

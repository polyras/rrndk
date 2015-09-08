define(function() {
  function Tutor(levelCount, canvasElement) {
    this.levelCount = levelCount;
    this.context = canvasElement.getContext('2d');
  }

  Tutor.prototype = {
    update: function() {
      this.context.textAlign = 'center';
      this.context.font = '26pt times new roman';
      this.context.fillStyle = '#555';

      switch(this.levelCount) {
        case 1:
        this.context.fillText("Drag passengers (small circles) onto ship (triangle).", 0, -210);
        this.context.fillText("Then, drag ship onto the other planet to the right.", 0, -160);
          break;
        case 2:
        this.context.fillText("Passengers' colors show their destination planet.", 0, -210);
        this.context.fillText("Green passengers go to the green planet, yellow to yellow, etc.", 0, -160);
          break;
        case 3:
        this.context.fillText("The small blip inside passengers grows as they get tired of waiting.", 0, -210);
        this.context.fillText("Get them home before their patience runs out!", 0, -160);
          break;
      }
    }
  };

  return Tutor;
});

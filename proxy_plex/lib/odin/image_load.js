define(function() {
  function ImageLoad(eventBus, path) {
    this.eventBus = eventBus;
    this.path = path;
  }

  ImageLoad.prototype = {
    execute: function() {
      this.image = new Image();
      this.image.onload = this.handleCompletion.bind(this);
      this.image.src = this.path;
    },
    handleCompletion: function() {
      var event = {
        type: 'loadCompletion',
        path: this.path,
        asset: this.image
      }
      this.eventBus.emit(event);
    }
  };

  return ImageLoad;
});

(function() {
  function Scene(options) {
    options.images = options.assets.images
    Cane.GroupLayer.call(this, options)
    this.assets = options.assets
    this.element = options.element
    this.keyboard = options.keyboard
    this.mouse = options.mouse
  }
  Scene.prototype = Object.create(Cane.GroupLayer.prototype)

  Cane.Scene = Scene
})()

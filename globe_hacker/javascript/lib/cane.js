function Cane(options) {
  this.clearColor = '#000'
  this.assets = new Cane.AssetManager(this)
  this.element = options.document.createElement('canvas')
  this.element.width = options.width
  this.element.height = options.height
  this.context = this.element.getContext('2d')
  this.document = options.document
  this.keyboard = new Cane.Keyboard(options.document)
  this.mouse = new Cane.Mouse(options.document, this.element)
  this.options = options
}
Cane.prototype = {
  nextTick: function() {
    requestAnimationFrame(this.tick.bind(this))
  },
  tick: function(timestamp) {
    if(this.lastTickAt) {
      var timeDelta = timestamp - this.lastTickAt
      if(timeDelta < 200) {
        this.update(timeDelta)
        this.draw(timeDelta)
      }
    }
    this.lastTickAt = timestamp
    this.nextTick()
  },
  start: function() {
    this.assets.load()
    this.nextTick()
  },
  update: function(timeDelta) {
    this.scene.update(timeDelta)
  },
  loadingComplete: function() {
    this.loaded = true
  },
  draw: function(timeDelta) {
    this.clear()
    this.scene.transformAndDraw(timeDelta)
  },
  buildScene: function(Constructor, options) {
    this.mouse.pressed = false

    if(!options) options = {}

    options.context = this.context
    options.assets = this.assets
    options.keyboard = this.keyboard
    options.element = this.element
    options.mouse = this.mouse
    options.document = this.document

    var scene = new Constructor(options)
    return scene
  },
  clear: function() {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.element.width, this.element.height)
  }
}

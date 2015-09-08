(function() {
  function Layer(options) {
    if(!options) throw new Error("Group wasn't given any options.")
    if(!options.context) throw new Error('Layer was not given a context.')
    if(!options.images) throw new Error("Layer wasn't given images.")
    if(!options.document) throw new Error("Layer wasn't given a document.")
    this.context = options.context
    this.document = options.document
    this.images = options.images
    this.x = 0
    this.y = 0
    this.z = 0
    this.rotation = 0
    this.scale = 1
  }

  Layer.prototype = {
    drawImage: function(image, x, y) {
      this.context.drawImage(image, x, y)
    },
    transformAndDraw: function() {
      this.context.save()
      if(this.x != 0 || this.y != 0) this.context.translate(this.x, this.y)
      if(this.rotation != 0) this.context.rotate(this.rotation)
      if(this.scale != 1) this.context.scale(this.scale, this.scale)
      this.draw()
      this.context.restore()
    },
    buildCanvas: function() {
      return document.createElement('canvas')
    }
  }

  Cane.Layer = Layer
})()

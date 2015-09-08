(function() {
  function GroupLayer(options) {
    Cane.Layer.call(this, options)
    this.options = options
    this.children = []
  }

  GroupLayer.prototype = Object.create(Cane.Layer.prototype)

  GroupLayer.prototype.reorderChildren = function() {
    this.children.sort(this.sort)
  }

  GroupLayer.prototype.sort = function(child1, child2) {
    return child1.z-child2.z
  }

  GroupLayer.prototype.buildLayer = function(Constructor, options) {
    if(!Constructor) throw new Error('GroupLayer requires a constructor to build a layer.')
    options = options || {}
    options.context = this.context
    options.images = this.images
    options.document = this.document

    var layer = new Constructor(options)
    return layer
  }

  GroupLayer.prototype.addChild = function(layer) {
    var isLayer = layer instanceof Cane.Layer
    if(!isLayer) throw new Error('Only Cane.Layer objects can be added as a child.')
    this.children.push(layer)
  }

  GroupLayer.prototype.removeChild = function(layer) {
    var index = this.children.indexOf(layer)
    if(index == -1) throw new Error("Cannot remove layer. It doesn't exist.")
    this.children.splice(index, 1)
  }

  GroupLayer.prototype.draw = function(timeDelta) {
    this.reorderChildren()
    this.children.forEach(function(child) {
      child.transformAndDraw()
    })
  }

  GroupLayer.prototype.update = function(timeDelta) {
    this.children.forEach(function(child) {
      if(child.update) child.update(timeDelta)
    })
  }

  Cane.GroupLayer = GroupLayer
})()

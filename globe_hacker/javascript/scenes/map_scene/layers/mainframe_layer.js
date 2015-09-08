(function() {
  var selectedScale = 1.3

  function MainframeLayer(options) {
    this.state = options.state
    this.mainframe = options.mainframe
    Cane.GroupLayer.call(this, options)

    this.backgroundLayer = this.buildLayer(Cane.Sprite)
    this.updateBackgroundLayerImage()
    this.addChild(this.backgroundLayer)

    var powerLayer = this.buildLayer(MapScene.MainframePowerLayer, { mainframe: this.mainframe, state: this.state })
    this.addChild(powerLayer)

    this.selectorLayer = this.buildLayer(Cane.Sprite)
    if(this.mainframe.size == 1) {
      this.selectorLayer.image = this.images['mainframes/small_selector.png']
    } else {
      this.selectorLayer.image = this.images['mainframes/large_selector.png']
    }
  }
  MainframeLayer.prototype = Object.create(Cane.GroupLayer.prototype)

  MainframeLayer.prototype.updateBackgroundLayerImage = function() {
    var size

    if(this.mainframe.size == 1) {
      size = "small"
    } else {
      size = "large"
    }
    this.backgroundLayer.image = this.images['mainframes/' + size + '_' + this.mainframe.commander.name + '_background.png']
  }

  MainframeLayer.prototype.update = function(timeDelta) {
    Cane.GroupLayer.prototype.update.call(this, timeDelta)
    this.updateBackgroundLayerImage()
    var mainframeIsSelected = this.state.selectedMainframe == this.mainframe
    if(!this.selectorAdded && mainframeIsSelected) {
      this.addChild(this.selectorLayer)
      this.selectorAdded = true
    }
    else if(!mainframeIsSelected && this.selectorAdded) {
      this.removeChild(this.selectorLayer)
      this.selectorAdded = false
    }
    if(this.selectorAdded) {
      this.selectorLayer.rotation += timeDelta/1600
    }
  }
  MapScene.MainframeLayer = MainframeLayer
})()

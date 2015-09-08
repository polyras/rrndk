(function() {
  function WorldLayer(options) {
    Cane.GroupLayer.call(this, options)
    this.state = options.state
    this.setupMainframesLayer()
    this.setupLinksLayer()
    this.transfersLayer = this.buildLayer(Cane.GroupLayer)
    this.addChild(this.transfersLayer)
    this.transfersLayer.z = 4

    var backgroundSprite = this.buildLayer(Cane.Sprite)
    backgroundSprite.x = this.images['world.jpg'].width/2
    backgroundSprite.y = this.images['world.jpg'].height/2
    backgroundSprite.image = this.images['world.jpg']
    this.addChild(backgroundSprite)

    this.setupMainframeNamesLayer()
  }
  WorldLayer.prototype = Object.create(Cane.GroupLayer.prototype)

  WorldLayer.prototype.setupMainframesLayer = function() {
    var mainframesLayer = this.buildLayer(Cane.GroupLayer)
    mainframesLayer.z = 5
    this.state.world.mainframes.forEach(function(mainframe) {
      var mainframeLayer = this.buildLayer(MapScene.MainframeLayer, { state: this.state, mainframe: mainframe })
      mainframeLayer.x = mainframe.x
      mainframeLayer.y = mainframe.y
      mainframesLayer.addChild(mainframeLayer)
    }.bind(this))
    this.addChild(mainframesLayer)
  }

  WorldLayer.prototype.setupMainframeNamesLayer = function() {
    var mainframeNamesLayer = this.buildLayer(Cane.GroupLayer)
    mainframeNamesLayer.z = 6
    this.state.world.mainframes.forEach(function(mainframe) {
      var mainframeNameLayer = this.buildLayer(MapScene.MainframeNameLayer, { mainframe: mainframe })
      mainframeNamesLayer.addChild(mainframeNameLayer)
    }.bind(this))
    this.addChild(mainframeNamesLayer)
  }

  WorldLayer.prototype.setupLinksLayer = function() {
    var linksLayer = this.buildLayer(Cane.GroupLayer)
    linksLayer.z = 3
    this.state.world.links.forEach(function(link) {
      var linkLayer = this.buildLayer(MapScene.LinkLayer, { link: link })
      linksLayer.addChild(linkLayer)
    }.bind(this))
    this.addChild(linksLayer)
  }

  WorldLayer.prototype.update = function(timeDelta) {
    Cane.GroupLayer.prototype.update.call(this, timeDelta)
    this.checkForNewTransfers()
    this.checkForDestroyedTransfers()
  }

  WorldLayer.prototype.checkForNewTransfers = function() {
    this.state.world.transfers.new.forEach(function(transfer) {
      var transferLayer = this.buildLayer(MapScene.TransferLayer, { transfer: transfer })
      this.transfersLayer.addChild(transferLayer)
    }.bind(this))
  }

  WorldLayer.prototype.checkForDestroyedTransfers = function() {
    this.state.world.transfers.destroyed.forEach(function(transfer) {
      this.transfersLayer.children.some(function(transferLayer) {
        if(transferLayer.transfer == transfer) {
          this.transfersLayer.removeChild(transferLayer)
          return true
        }
      }.bind(this))
    }.bind(this))
  }

  MapScene.WorldLayer = WorldLayer
})()

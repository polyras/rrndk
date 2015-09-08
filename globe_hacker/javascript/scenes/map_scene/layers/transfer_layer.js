(function() {
  function TransferLayer(options) {
    Cane.Layer.call(this, options)
    this.transfer = options.transfer
    this.updatePosition()
    this.image = this.images['transfers/' + this.transfer.commander.name + '.png']
    this.scale = 0.25 + (this.transfer.charge/25)*0.75
  }
  TransferLayer.prototype = Object.create(Cane.Sprite.prototype)

  TransferLayer.prototype.update = function(timeDelta) {
    this.updatePosition()
    this.rotation += timeDelta*0.00625
  }

  TransferLayer.prototype.updatePosition = function() {
    this.x = this.transfer.x
    this.y = this.transfer.y
  }

  MapScene.TransferLayer = TransferLayer
})()

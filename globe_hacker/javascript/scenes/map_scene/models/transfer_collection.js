(function() {
  function TransferCollection() {
    MapScene.Collection.call(this)
  }
  TransferCollection.prototype = Object.create(MapScene.Collection.prototype)

  TransferCollection.prototype.newTick = function() {
    this.new = []
    this.destroyed = []
  }

  TransferCollection.prototype.add = function(transfer) {
    MapScene.Collection.prototype.add.call(this, transfer)
    this.new.push(transfer)
  }

  TransferCollection.prototype.update = function(timeDelta) {
    MapScene.Collection.prototype.update.call(this, timeDelta)
    var transfer
    for(var i=0; this.list.length>i; i++) {
      transfer = this.list[i]
      if(transfer.destroyed) {
        this.list.splice(i, 1)
        this.destroyed.push(transfer)
        i--
      }
    }
  }

  MapScene.TransferCollection = TransferCollection
})()

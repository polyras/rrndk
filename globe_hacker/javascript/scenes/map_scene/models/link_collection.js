(function() {
  function LinkCollection() {
    MapScene.Collection.call(this)
  }

  LinkCollection.prototype = Object.create(MapScene.Collection.prototype)

  LinkCollection.prototype.findAllByMainframe = function(mainframe) {
    return this.findAll(function(link) {
      return link.mainframes.indexOf(mainframe) != -1
    })
  }

  MapScene.LinkCollection = LinkCollection
})()

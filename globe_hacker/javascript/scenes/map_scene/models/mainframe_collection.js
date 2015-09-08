(function() {
  function MainframeCollection() {
    MapScene.Collection.call(this)
  }

  MainframeCollection.prototype = Object.create(MapScene.Collection.prototype)

  MainframeCollection.prototype.findAt = function(x, y) {
    return this.find(function(mainframe) {
      return(
        mainframe.x - mainframe.radius < x &&
        mainframe.x + mainframe.radius > x &&
        mainframe.y - mainframe.radius < y &&
        mainframe.y + mainframe.radius > y
      )
    })
  }

  MainframeCollection.prototype.findAllByCommander = function(commander) {
    return this.findAll(function(mainframe) {
      return mainframe.commander == commander
    })
  }

  MapScene.MainframeCollection = MainframeCollection
})()

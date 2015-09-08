(function() {
  function World(data, sounds) {
    this.mainframes = new MapScene.MainframeCollection
    this.links = new MapScene.LinkCollection
    this.transfers = new MapScene.TransferCollection

    this.commanders = {
      player: { name: 'player' },
      computer: { name: 'computer' }
    }

    data.mainframes.forEach(function(mainframeData) {
      var options = {
        world: this,
        id: mainframeData.id,
        name: mainframeData.name,
        x: mainframeData.x,
        y: mainframeData.y,
        size: mainframeData.size,
        sounds: sounds
      }
      var mainframe = new MapScene.Mainframe(options)
      this.mainframes.add(mainframe)
    }.bind(this))

    data.links.forEach(function(linkData) {
      var mainframe1 = this.mainframes.findById(linkData.mainframeIds[0])
      var mainframe2 = this.mainframes.findById(linkData.mainframeIds[1])
      var link = new MapScene.Link([mainframe1, mainframe2])
      this.links.add(link)
    }.bind(this))
  }
  World.prototype = {
    newTick: function() {
      this.transfers.newTick()
    },
    update: function(timeDelta) {
      this.transfers.update(timeDelta)
      this.mainframes.update(timeDelta)
    }
  }

  MapScene.World = World
})()

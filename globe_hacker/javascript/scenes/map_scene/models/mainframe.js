(function() {
  var connectedCache = {}

  function Mainframe(options) {
    this.id = options.id
    this.x = options.x
    this.y = options.y
    this.name = options.name
    this.size = options.size
    this.sounds = options.sounds
    this.world = options.world
    if(this.size == 1) {
      this.radius = 18
      this.maxPower = 10
    } else {
      this.radius = 26
      this.maxPower = 50
    }
    this.power = Math.round(this.maxPower/2)
    this.commander = this.id == 1 ? this.world.commanders.player : this.world.commanders.computer
    
    this.timeSinceLastPowerIncrease = 0
    this.powerIncreaseInterval = 2000/Math.pow(this.size, 1.4)
  }

  Mainframe.prototype = {
    transfer: function(mainframe) {
      var path = this.getPathTo(mainframe)
      if(path) {
        var charge = Math.floor(this.power/2)
        if(charge) {
          this.power -= charge
          var transferOptions = {
            charge: charge,
            commander: this.commander,
            path: path,
            sounds: this.sounds
          }
          var transfer = new MapScene.Transfer(transferOptions)
          this.world.transfers.add(transfer)
          return true
        }
      } else {
        return false
      }
    },
    getDistanceTo: function(mainframe) {
      var xDifSquared = Math.pow(this.x-mainframe.x, 2)
      var yDifSquared = Math.pow(this.y-mainframe.y, 2)
      return Math.sqrt(xDifSquared + yDifSquared)
    },
    getLinkedDistanceTo: function(mainframe) {
      return this.getPathTo(mainframe).getLength()
    },
    getPathTo: function(mainframe) {
      var pathFinder = new MapScene.PathFinder(this, mainframe)
      pathFinder.execute()
      if(pathFinder.result) {
        var path = new MapScene.Path(pathFinder.result)
        return path
      }
    },
    getPowerPercentage: function() {
      return this.power/this.maxPower
    },
    findLinkTo: function(mainframe) {
      return this.world.links.find(function(link) {
        return link.mainframes.indexOf(mainframe) != -1 && link.mainframes.indexOf(this) != -1
      }.bind(this))
    },
    update: function(timeDelta) {
      this.timeSinceLastPowerIncrease += timeDelta
      if(this.timeSinceLastPowerIncrease > this.powerIncreaseInterval) {
        this.timeSinceLastPowerIncrease -= this.powerIncreaseInterval
        this.changePower(1)
      }
    },
    findNearbyEnemies: function() {
      return this.world.mainframes.findAll(function(mainframe) {
        return this.commander != mainframe.commander && this.getDistanceTo(mainframe) < 300
      }.bind(this))
    },
    changePower: function(charge) {
      this.power += charge
      this.power = this.power.clamp(0, this.maxPower)
    },
    findConnectedMainframes: function() {
      var accessibleEntities = [this]
      var openList = this.findNeighbours()
      var e
      var q = 0
      while(openList.length != 0) {
        if(q++ == 200) throw new Error('safety stop!')
        e = openList.shift()
        accessibleEntities.push(e)
        if(e.commander == this.commander) {
          e.findNeighbours().forEach(function(neighbour) {
            if(accessibleEntities.indexOf(neighbour) == -1) {
              openList.push(neighbour)
            }
          })
        }
      }
      return accessibleEntities
    },
    isConnectedTo: function(mainframe) {
      if(!connectedCache[this.id]) connectedCache[this.id] = {}
      if(typeof(connectedCache[this.id][mainframe.id]) == 'undefined') {
        connectedCache[this.id][mainframe.id] = this.findConnectedMainframes().indexOf(mainframe) != -1
      }
      return connectedCache[this.id][mainframe.id]
    },
    hasEnemyNeighbours: function() {
      var neighbours = this.findNeighbours()
      return neighbours.some(function(neighbour) {
        if(neighbour.commander != this.commander) return true
      }.bind(this))
    },
    findNeighbours: function() {
      var links = this.world.links.findAllByMainframe(this)
      var result = []
      links.forEach(function(link) {
        link.mainframes.forEach(function(mainframe) {
          if(mainframe != this) result.push(mainframe)
        }.bind(this))
      }.bind(this))
      return result
    }
  }

  MapScene.Mainframe = Mainframe
})()

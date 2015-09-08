(function() {
  var resistanceIncreaseSpeeds = {
    easy: 1,
    medium: 2,
    hard: 3
  }

  function CommanderAI(world, difficulty) {
    this.world = world
    this.thinkInterval = 2000
    this.timeUntilNextThink = this.thinkInterval
    this.me = world.commanders.computer
    this.resistance = 0
    this.resistanceIncreaseSpeed = resistanceIncreaseSpeeds[difficulty]
  }

  CommanderAI.prototype = {
    update: function(timeDelta) {
      if(this.resistance < 1)
        this.resistance += timeDelta/1000000*this.resistanceIncreaseSpeed
      this.timeUntilNextThink -= timeDelta
      if(this.timeUntilNextThink <= 0) {
        this.timeUntilNextThink += this.thinkInterval
        this.think()
      }
    },
    think: function() {
      this.updateMainframeAIs()
      var d = new Date()
      this.mainframeAIs.forEach(function(mainframeAI) {
        if(Math.random() < this.resistance/2) {// simulating it can't command everybody all the time
          mainframeAI.think()
        }
      }.bind(this))
    },
    updateMainframeAIs: function() {
      var mainframes = this.world.mainframes.findAllByCommander(this.me)
      this.mainframeAIs = mainframes.map(function(mainframe) {
        var mainframeAI = new MapScene.MainframeAI(mainframe, this)
        return mainframeAI
      }.bind(this))
    }
  }

  MapScene.CommanderAI = CommanderAI
})()

(function() {
  function State(data, difficulty, sounds) {
    this.world = new MapScene.World(data, sounds)
    this.startedAt = new Date
    this.cameraPosition = {
      x: 1292,
      y: 400
    }
    this.ai = new MapScene.CommanderAI(this.world, difficulty)
    this.outcomeCheckInterval = 2000
    this.timeUntilNextOutcomeCheck = this.outcomeCheckInterval
  }

  State.prototype = {
    update: function(timeDelta) {
      this.ai.update(timeDelta)
      this.world.update(timeDelta)
      this.checkOutcome(timeDelta)
    },
    checkOutcome: function(timeDelta) {
      this.timeUntilNextOutcomeCheck -= timeDelta
      if(this.timeUntilNextOutcomeCheck <= 0) {
        this.timeUntilNextOutcomeCheck += this.outcomeCheckInterval
        this.updateOutcome()
      }
    },
    updateOutcome: function() {
      var potentialWinner, mainframe
      var list = this.world.mainframes.list
      for(var i=0; list.length>i; i++) {
        mainframe = list[i]
        if(!potentialWinner) {
          potentialWinner = mainframe.commander
        }
        else if(potentialWinner != mainframe.commander) {
          potentialWinner = null
          break;
        }
      }

      if(potentialWinner) {
        this.endedAt = new Date
        this.winner = potentialWinner
      }
    }
  }

  MapScene.State = State
})()

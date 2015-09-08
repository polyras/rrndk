(function() {
  desiredPowerPercentageWhenNotThreatened = 0.3
  desiredPowerPercentageWhenThreatened = 1

  function MainframeAI(mainframe, commanderAI) {
    this.mainframe = mainframe
    this.commanderAI = commanderAI
  }
  MainframeAI.prototype = {
    think: function() {
      if(this.mainframe.getPowerPercentage() > 0.75) {
        this.attack()
      }
      /*
      help others
      if(this.feelsSafe()) {
        this.helpNearestUnsafeAlly()
      }
      */
    },
    attack: function() {
      var nearbyEnemies = this.mainframe.findNearbyEnemies()
      if(nearbyEnemies.length) {
        nearbyEnemies.sort(function(mainframe1, mainframe2) {
          return mainframe1.getDistanceTo(this.mainframe) > mainframe2.getDistanceTo(this.mainframe) ? 1 : -1
        }.bind(this))
        this.mainframe.transfer(nearbyEnemies[0])
      }
    },
    feelsSafe: function() {
      var desiredPowerPercentage = this.mainframe.hasEnemyNeighbours() ? desiredPowerPercentageWhenThreatened : desiredPowerPercentageWhenNotThreatened
      return desiredPowerPercentage <= this.mainframe.getPowerPercentage()
    },
    helpNearestUnsafeAlly: function() {
      var nearest
      this.commanderAI.mainframeAIs.filter(function(mainframeAI) {
        if(mainframeAI != this) {
          if(!mainframeAI.feelsSafe()) {
            if(mainframeAI.mainframe.getDistanceTo(this.mainframe) < 500) {
              if(this.mainframe.isConnectedTo(mainframeAI.mainframe)) {
                this.mainframe.transfer(mainframeAI.mainframe)
                return false
              }
            }
          }
        }
      }.bind(this))
      /*
      var unsafeConnectedAllyMainframeAIs = this.commanderAI.mainframeAIs.filter(function(mainframeAI) {
        return mainframeAI != this && !mainframeAI.feelsSafe() && this.mainframe.isConnectedTo(mainframeAI.mainframe)
      }.bind(this))
      if(unsafeConnectedAllyMainframeAIs.length) {
        var unsafeConnectedAllyMainframes = unsafeConnectedAllyMainframeAIs.map(function(ai) {
          return ai.mainframe
        })

        unsafeConnectedAllyMainframes.sort(function(mainframe1, mainframe2) {
          return mainframe1.getDistanceTo(this.mainframe) > mainframe2.getDistanceTo(this.mainframe) ? 1 : -1
        }.bind(this))

        this.mainframe.transfer(unsafeConnectedAllyMainframes[0])
      }
      */
    }
  }

  MapScene.MainframeAI = MainframeAI
})()

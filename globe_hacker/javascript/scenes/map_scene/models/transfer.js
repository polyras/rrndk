(function() {
  function Transfer(options) {
    this.sounds = options.sound
    this.path = options.path
    this.segmentIndex = 0
    this.sounds = options.sounds
    this.charge = options.charge
    this.commander = options.commander
    this.distanceTraveled = 0
  }

  Transfer.prototype = {
    getCurrentLink: function() {
      return this.getCurrentSegment().link
    },
    getCurrentSegment: function() {
      return this.path.segments[this.segmentIndex]
    },
    update: function(timeDelta) {
      this.distanceTraveled += timeDelta/50
      if(this.distanceTraveled > this.getCurrentLink().length) {
        this.distanceTraveled -= this.getCurrentLink().length
        this.segmentIndex++
        if(!this.getCurrentSegment())
          this.arrived()
      } else {
        this.updatePosition()
      }
    },
    updatePosition: function() {
      var progress = this.distanceTraveled/this.getCurrentLink().length
      var coors = this.getCurrentLink().interpolate(progress, this.getCurrentSegment().destinationMainframe)
      this.x = coors.x
      this.y = coors.y
    },
    arrived: function() {
      var destination = this.path.getDestination()
      this.destroyed = true
      if(destination.commander == this.commander) {
        destination.changePower(this.charge)
      } else {
        destination.changePower(-this.charge)
        if(destination.power == 0) {
          destination.commander = this.commander
          if(this.commander.name == 'player') {
            this.sounds.wee.play()
          } else {
            this.sounds.oh.play()
          }
        } else {
          this.sounds.kkw.play()
        }
      }
    }
  }

  MapScene.Transfer = Transfer
})()

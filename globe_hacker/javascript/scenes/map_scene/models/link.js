(function() {
  function Link(mainframes) {
    this.mainframes = mainframes
    this.length = this.getLength()
  }

  Link.prototype = {
    getLength: function() {
      var xDifSquared = Math.pow(this.mainframes[1].x-this.mainframes[0].x, 2)
      var yDifSquared = Math.pow(this.mainframes[1].y-this.mainframes[0].y, 2)
      return Math.sqrt(xDifSquared + yDifSquared)
    },
    interpolate: function(progress, destination) {
      if(destination == this.mainframes[0]) progress = 1-progress
      var x = (this.mainframes[1].x-this.mainframes[0].x)*progress + this.mainframes[0].x
      var y = (this.mainframes[1].y-this.mainframes[0].y)*progress + this.mainframes[0].y
      
      return {
        x: x,
        y: y
      }
    }
  }

  MapScene.Link = Link
})()

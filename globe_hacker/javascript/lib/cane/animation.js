(function() {
  function Animation(options) {
    this.framesCount = options.framesCount
    this.setupFrames(options.sheet)
    this.frameIndex = 0
    this.frameInterval = 1000/options.fps
    this.timeUntilNextFrame = this.frameInterval
  }

  Animation.prototype = {
    update: function(timeDelta) {
      this.timeUntilNextFrame -= timeDelta
      if(this.timeUntilNextFrame < 0) {
        this.timeUntilNextFrame += this.frameInterval
        this.frameIndex++
        if(this.frameIndex == this.framesCount) {
          this.frameIndex = 0
        }
      }
      this.image = this.frames[this.frameIndex]
    },
    setupFrames: function(sheet) {
      this.frames = []
      var frameWidth = sheet.width/this.framesCount

      for(var i=0; this.framesCount>=i; i++) {
        canvas = document.createElement('canvas')
        canvas.width = frameWidth
        canvas.height = sheet.height
        context = canvas.getContext('2d')
        context.drawImage(sheet, -i*frameWidth, 0)
        this.frames.push(canvas)
      }
    }
  }

  Cane.Animation = Animation
})()

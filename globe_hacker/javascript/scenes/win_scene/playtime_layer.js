(function() {
  function PlaytimeLayer(options) {
    Cane.Layer.call(this, options)
    this.x = options.element.width/2
    this.y = options.element.height*0.54
    this.playtime = options.playtime
  }
  PlaytimeLayer.prototype = Object.create(Cane.Layer.prototype)

  PlaytimeLayer.prototype.draw = function() {
    this.context.shadowColor = 'rgba(0, 0, 0, 1)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 30
    this.context.fillStyle = '#fff'
    this.context.font = "bold 26px Arial"
    this.context.textAlign = 'center'
    this.context.fillText('Time: ' + this.getPlaytimeFormatted(), 0, 0)
  }

  PlaytimeLayer.prototype.getPlaytimeFormatted = function() {
    var minutes = Math.floor(this.playtime/60)
    if(minutes < 10) minutes = "0" + minutes

    var seconds = this.playtime%60
    if(seconds < 10) seconds = "0" + seconds

    return minutes + ":" + seconds
  }

  WinScene.PlaytimeLayer = PlaytimeLayer
})()

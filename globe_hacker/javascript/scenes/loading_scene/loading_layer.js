(function() {
  function LoadingLayer(options) {
    Cane.Layer.call(this, options)
  }

  LoadingLayer.prototype = Object.create(Cane.Layer.prototype)

  LoadingLayer.prototype.draw = function() {
    this.context.fillStyle = '#fff'
    this.context.font = 'bold 24px Arial'
    this.context.fillText('Hang on while I grab some files from the interwebs!', 10, 100)
  }

  LoadingScene.LoadingLayer = LoadingLayer
})()

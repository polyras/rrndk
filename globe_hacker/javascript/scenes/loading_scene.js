function LoadingScene(options) {
  Cane.Scene.call(this, options)
  var loadingLayer = this.buildLayer(LoadingScene.LoadingLayer)
  this.addChild(loadingLayer)
}

LoadingScene.prototype = Object.create(Cane.Scene.prototype)

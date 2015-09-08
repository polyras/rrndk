(function() {
  function AssetManager(delegate) {
    this.delegate = delegate
    this.loaders = []
    this.loadersCompleted = 0

    this.setupLoader('images', Cane.ImageLoader)
    this.setupLoader('sounds', Cane.SoundLoader)
    this.setupLoader('texts', Cane.TextLoader)
  }
  AssetManager.prototype = {
    load: function() {
      this.loaders.forEach(function(loader) {
        loader.start()
      })
    },
    setupLoader: function(name, Constructor) {
      var loader = new Constructor(this)
      this.loaders.push(loader)
      this[name] = loader
    },
    loaderComplete: function(loader) {
      this.loadersCompleted++
      if(this.loadersCompleted == this.loaders.length) this.delegate.loadingComplete()
    }
  }

  Cane.AssetManager = AssetManager
})()

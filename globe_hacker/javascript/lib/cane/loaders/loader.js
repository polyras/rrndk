(function() {
  function Loader(delegate) {
    this.delegate = delegate
    this.shortPaths = []
    this.filesCompleted = 0
  }
  Loader.prototype = {
    add: function(shortPath) {
      if(this.loadStarted) throw new Error("You can't add files after a loader has started loading.")
      this.shortPaths.push(shortPath)
    },
    start: function() {
      this.loadStarted = true
      if(this.shortPaths.length != 0) {
        var i = 0
        this.shortPaths.forEach(function(shortPath) {
          /* Very ugly hack to ensure files are downloaded slowly */
          setTimeout(function() {
            this.loadShortPath(shortPath)
          }.bind(this), (i++)*250)
        }.bind(this))
      } else {
        this.complete()
      }
    },
    loadShortPath: function(shortPath) {
      var fullPath = shortPath
      if(this.prefix) fullPath = this.prefix + fullPath
      if(this.suffix) fullPath += this.suffix
      this.load(shortPath, fullPath)
    },
    assetLoaded: function(shortPath, asset) {
      this[shortPath] = asset
      this.filesCompleted++
      if(this.filesCompleted == this.shortPaths.length) this.complete()
    },
    complete: function() {
      this.delegate.loaderComplete(this)
    }
  }

  Cane.Loader = Loader
})()

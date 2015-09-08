(function() {
  function TextLoader(delegate) {
    Cane.Loader.call(this, delegate)
  }
  TextLoader.prototype = Object.create(Cane.Loader.prototype)

  TextLoader.prototype.load = function(shortPath, fullPath) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
      if(request.readyState === 4)
        this.assetLoaded(shortPath, request.responseText)
    }.bind(this)
    request.open('GET', fullPath)
    request.send()
  }

  Cane.TextLoader = TextLoader
})()

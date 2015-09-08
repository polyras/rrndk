(function() {
  function Path(mainframes) {
    this.segments = []
    for(var i=0; mainframes.length-1>i; i++) {
      var link = mainframes[i].findLinkTo(mainframes[i+1])
      this.addSegment(link, mainframes[i+1])
    }
  }

  Path.prototype = {
    addSegment: function(link, destinationMainframe) {
      var segment = {
        link: link,
        destinationMainframe: destinationMainframe
      }
      this.segments.push(segment)
    },
    getDestination: function() {
      return this.segments[this.segments.length-1].destinationMainframe
    },
    getLength: function() {
      return this.segments.reduce(function(length, segment) { return length + segment.link.length }, 0)
    }
  }

  MapScene.Path = Path
})()

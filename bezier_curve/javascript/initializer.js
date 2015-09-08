(function() {
  var canvasEl, curver

  var initialize = function() {
    canvasEl = document.createElement('canvas')
    updateSize()
    document.body.appendChild(canvasEl)
    curver = new BezierCurver(canvasEl)
    curver.initialize()
  }

  function updateSize() {
    canvasEl.width = document.documentElement.clientWidth
    canvasEl.height = document.documentElement.clientHeight
    if(curver) curver.draw()
  }

  window.addEventListener('load', initialize)
  window.addEventListener('resize', updateSize)
})()

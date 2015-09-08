(function() {
  function Mouse(document, element) {
    document.addEventListener('mousemove', this.move.bind(this))
    element.addEventListener('mousedown', this.down.bind(this))
    document.addEventListener('mouseup', this.up.bind(this))
    this.pressed = false
    this.element = element
  }
  Mouse.prototype = {
    move: function(e) {
      this.x = e.pageX - this.element.offsetLeft
      this.y = e.pageY - this.element.offsetTop
    },
    down: function(e) {
      this.pressed = true
    },
    up: function() {
      this.pressed = false
    }
  }

  Cane.Mouse = Mouse
})()

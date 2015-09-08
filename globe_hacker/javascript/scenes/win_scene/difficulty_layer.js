(function() {
  function DifficultyLayer(options) {
    Cane.Layer.call(this, options)
    this.x = options.element.width/2
    this.y = options.element.height*0.59
    this.difficulty = options.difficulty
  }
  DifficultyLayer.prototype = Object.create(Cane.Layer.prototype)

  DifficultyLayer.prototype.draw = function() {
    this.context.shadowColor = 'rgba(0, 0, 0, 1)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 30
    this.context.fillStyle = '#fff'
    this.context.font = "bold 26px Arial"
    this.context.textAlign = 'center'
    var difficultyFormatted = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)
    this.context.fillText('Difficulty: ' + difficultyFormatted, 0, 0)
  }

  WinScene.DifficultyLayer = DifficultyLayer
})()

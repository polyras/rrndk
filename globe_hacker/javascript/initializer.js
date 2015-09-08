(function() {
  var options = {
    document: document
  }
  function initialize() {
    var game = new Game(options)
    var gameContainer = document.getElementsByClassName('game')[0]
    gameContainer.appendChild(game.element)
    game.start()
  }
  window.addEventListener('load', initialize)
})()

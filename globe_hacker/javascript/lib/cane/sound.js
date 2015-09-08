(function() {
  var Sound = function(audio) {
    this.audio = audio
  }

  Sound.prototype = {
    play: function() {
      var audio = new Audio
      audio.src = this.audio.src
      audio.play()
      return audio
    }
  }

  Cane.Sound = Sound
})()

define(function() {
  var keyCodeMap = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
  };

  function Keyboard(document) {
    this.document = document;
    this.pressedCallback = this.keyPressed.bind(this);
    this.releasedCallback = this.keyReleased.bind(this);
    this.keysPressed = {};
    this.resume();
  }

  Keyboard.prototype = {
    resume: function() {
      this.document.addEventListener('keydown', this.pressedCallback);
      this.document.addEventListener('keyup', this.releasedCallback);
    },
    pause: function() {
      this.document.removeEventListener('keydown', this.pressedCallback);
      this.document.removeEventListener('keyup', this.releasedCallback);
    },
    keyPressed: function(e) {
      var keyName = keyCodeMap[e.keyCode];
      if(keyName) {
        this.keysPressed[keyName] = true;
      }
    },
    keyReleased: function(e) {
      var keyName = keyCodeMap[e.keyCode];
      if(keyName && this.keysPressed[keyName]) {
        delete this.keysPressed[keyName];
      }
    },
    anyKeysPressed: function() {
      return Object.keys(this.keysPressed).length !== 0;
    }
  };

  return Keyboard;
});

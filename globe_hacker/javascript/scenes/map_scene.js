(function() {
  var cameraSpeed = 5
  var dragTolerance = 3 // in pixels

  function MapScene(options) {
    Cane.Scene.call(this, options)
    this.state = new MapScene.State(this.getDataFormatted(), options.difficulty, this.assets.sounds)
    this.worldLayer = this.buildLayer(MapScene.WorldLayer, { state: this.state })
    this.addChild(this.worldLayer)

    var resistanceLayer = this.buildLayer(MapScene.ResistanceLayer, { ai: this.state.ai })
    resistanceLayer.z = 2
    this.addChild(resistanceLayer)
  }

  MapScene.prototype = Object.create(Cane.Scene.prototype)

  MapScene.prototype.update = function(timeDelta) {
    this.state.world.newTick()
    this.checkMouse()
    this.checkEscape()
    this.updateCamera(timeDelta)
    this.updateWorldLayerPosition()
    this.state.update(timeDelta)
    if(this.state.selectedMainframe && this.state.selectedMainframe.commander == this.state.world.commanders.computer) {
      this.state.selectedMainframe = null
    }
    Cane.Scene.prototype.update.call(this, timeDelta)
    if(this.state.winner) {
      if(this.state.winner == this.state.world.commanders.player) {
        this.outcome = 'victory'
      } else {
        this.outcome = 'loss'
      }

      this.playtime = Math.floor((this.state.endedAt-this.state.startedAt)/1000)
    }
  }

  MapScene.prototype.checkEscape = function() {
    if(this.keyboard.keysPressed.escape && this.state.selectedMainframe) {
      this.state.selectedMainframe = null
    }
  }

  MapScene.prototype.updateCamera = function(timeDelta) {
    var xDirection
    if(this.keyboard.keysPressed.right) {
      xDirection = 1
    }
    else if(this.keyboard.keysPressed.left) {
      xDirection = -1
    }
    if(xDirection) {
      this.state.cameraPosition.x += (timeDelta/10*cameraSpeed)*xDirection
    }
    var yDirection
    if(this.keyboard.keysPressed.down) {
      yDirection = 1
    }
    else if(this.keyboard.keysPressed.up) {
      yDirection = -1
    }
    if(yDirection) {
      this.state.cameraPosition.y += (timeDelta/10*cameraSpeed)*yDirection
    }
    this.clampCameraPosition()
  }

  MapScene.prototype.clampCameraPosition = function() {
    this.state.cameraPosition.x = this.state.cameraPosition.x.clamp(this.element.width/2, this.assets.images['world.jpg'].width-this.element.width/2)
    this.state.cameraPosition.y = this.state.cameraPosition.y.clamp(this.element.height/2, this.assets.images['world.jpg'].height-this.element.height/2)
  }

  MapScene.prototype.updateWorldLayerPosition = function() {
    this.worldLayer.x = -this.state.cameraPosition.x + this.element.width/2
    this.worldLayer.y = -this.state.cameraPosition.y + this.element.height/2
  }

  MapScene.prototype.getDataFormatted = function() {
    var data = {}
    data.mainframes = JSON.parse(this.assets.texts.mainframes)
    data.links = JSON.parse(this.assets.texts.links)
    return data
  }

  MapScene.prototype.checkMouse = function() {
    if(this.mouse.pressed && !this.mousePressedAt) {
      this.mousePressedAt = { x: this.mouse.x, y: this.mouse.y }
    }
    else if(this.mousePressedAt && !this.mouse.pressed) {
      this.mousePressedAt = null
      if(!this.dragging) this.click()
    }
    if(!this.mouse.pressed && this.dragging) this.dragging = false
    if(this.mousePressedAt && (Math.abs(this.mousePressedAt.x-this.mouse.x) > dragTolerance || Math.abs(this.mousePressedAt.y-this.mouse.y) > dragTolerance)) {
      this.dragging = true
      this.state.cameraPosition.y += this.mousePressedAt.y-this.mouse.y
      this.state.cameraPosition.x += this.mousePressedAt.x-this.mouse.x
      this.mousePressedAt = { x: this.mouse.x, y: this.mouse.y }
    }
  }

  MapScene.prototype.click = function() {
    var mainframe = this.state.world.mainframes.findAt(
      this.mouse.x + this.state.cameraPosition.x - this.element.width/2,
      this.mouse.y + this.state.cameraPosition.y - this.element.height/2
    )

    if(mainframe) {
      if(this.state.selectedMainframe) {
        if(mainframe != this.state.selectedMainframe) {
          if(this.state.selectedMainframe.transfer(mainframe)) {
            this.assets.sounds.plop.play()
          } else {
            this.assets.sounds.zzz.play()
          }
        }
      } else {
        if(mainframe.commander == this.state.world.commanders.player) {
          this.assets.sounds.small_tick.play()
          this.state.selectedMainframe = mainframe
        }
      }
    } else if(this.state.selectedMainframe) {
      this.state.selectedMainframe = null
    }
  }

  window.MapScene = MapScene
})()

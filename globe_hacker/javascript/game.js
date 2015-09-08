function Game(options) {
  options.width = 950
  options.height = 600
  Cane.call(this, options)
  this.loadingScene = this.buildScene(LoadingScene)
  this.scene = this.loadingScene
  this.addImages()
  this.addSounds()
  this.addTexts()
}
Game.prototype = Object.create(Cane.prototype)

Game.prototype.update = function(timeDelta) {
  /* uuuuugly code :-( */
  if(this.scene == this.loadingScene && this.loaded) {
    this.gotoSplashScene()
  }
  else if(this.scene == this.splashScene && this.scene.completed) {
    this.storyScene = this.buildScene(StoryScene)
    this.scene = this.storyScene
  }
  else if(this.scene == this.storyScene && this.scene.completed) {
    this.difficultiesScene = this.buildScene(DifficultiesScene)
    this.scene = this.difficultiesScene
  }
  else if(this.scene == this.difficultiesScene && this.scene.completed) {
    this.difficulty = this.scene.difficulty
    this.instructionsScene = this.buildScene(InstructionsScene)
    this.scene = this.instructionsScene
  }
  else if(this.scene == this.instructionsScene && this.scene.completed) {
    this.backgroundMusic = this.assets.sounds.background_music.play()
    this.backgroundMusic.loop = true

    this.mapScene = this.buildScene(MapScene, { difficulty: this.difficulty })
    this.scene = this.mapScene
  }
  else if(this.scene == this.mapScene) {
    if(this.mapScene.outcome) {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0

      if(this.mapScene.outcome == 'victory') {
        this.winScene = this.buildScene(WinScene, { playtime: this.mapScene.playtime, difficulty: this.difficulty })
        this.scene = this.winScene
      }
      else if(this.mapScene.outcome == 'loss') {
        this.lossScene = this.buildScene(LossScene, { playtime: this.mapScene.playtime })
        this.scene = this.lossScene
      }
    }
  }
  else if(this.scene == this.winScene || this.scene == this.lossScene) {
    if(this.scene.completed) {
      this.gotoSplashScene()
    }
  }
  Cane.prototype.update.call(this, timeDelta)
}

Game.prototype.gotoSplashScene = function() {
  this.splashScene = this.buildScene(SplashScene)
  this.scene = this.splashScene
}
Game.prototype.addSounds = function() {
  var sounds = this.assets.sounds
  sounds.prefix = './sounds/'
  sounds.suffix = '.ogg'
  sounds.add('background_music')
  sounds.add('small_tick')
  sounds.add('plop')
  sounds.add('zzz')
  sounds.add('oh')
  sounds.add('wee')
  sounds.add('kkw')
}
Game.prototype.addImages = function() {
  var images = this.assets.images
  images.prefix = './images/'
  images.add('mainframes/small_computer_background.png')
  images.add('mainframes/large_computer_background.png')
  images.add('mainframes/small_player_background.png')
  images.add('mainframes/large_player_background.png')
  images.add('mainframes/small_power.png')
  images.add('mainframes/large_power.png')
  images.add('mainframes/large_selector.png')
  images.add('mainframes/small_selector.png')
  images.add('photo.png')
  images.add('difficulties.png')
  images.add('transfers/player.png')
  images.add('transfers/computer.png')
  images.add('menu_bg.jpg')
  images.add('resistance/background.png')
  images.add('resistance/red.png')
  images.add('resistance/green.png')
  images.add('world.jpg')
  images.add('texts/story1.png')
  images.add('texts/story2.png')
  images.add('texts/instructions.png')
}
Game.prototype.addTexts = function() {
  var texts = this.assets.texts
  texts.prefix = './texts/'
  texts.suffix = '.json'
  texts.add('mainframes')
  texts.add('links')
}

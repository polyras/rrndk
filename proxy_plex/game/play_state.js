define([
  'lib/valhalla/event_bus',
  'lib/valhalla/database',
  './input_manager',
  './renderer',
  './seeking_processor',
  './creator',
  './behavior',
  './passenger_spawner',
  './passenger_containment_manager',
  './docking_registry',
  './flight_preview_manager',
  './hit_finder',
  './position_updater',
  './parenting_updater',
  './steering_processor',
  './patience_processor',
  './win_monitor',
  './mouse_event_delegation',
  './lose_state',
  './win_state',
  './level_creator',
  './tutor'
], function(EventBus, Database, InputManager, Renderer, SeekingProcessor, Creator, Behavior, PassengerSpawner, PassengerContainmentManager, DockingRegistry, FlightPreviewManager, HitFinder, PositionUpdater, ParentingUpdater, SteeringProcessor, PatienceProcessor, WinMonitor, MouseEventDelegation, LoseState, WinState, LevelCreator, Tutor) {
  function PlayState(system, levelCount) {
    this.levelCount = levelCount;
    this.system = system;
    var eventBus = new EventBus();
    var camera = { zoom: 40 };
    var passengerContainmentManager = new PassengerContainmentManager(eventBus);
    this.mouseEventDelegation = new MouseEventDelegation(system.eventBus, eventBus);
    this.dockingRegistry = new DockingRegistry(eventBus);
    this.patienceProcessor = new PatienceProcessor(eventBus);
    this.passengerContainmentManager = passengerContainmentManager;
    this.eventBus = eventBus;
    this.tutor = new Tutor(levelCount, system.canvasElement);
    this.database = new Database(eventBus);
    this.creator = new Creator(this.database, passengerContainmentManager, this.dockingRegistry);
    this.parentingUpdater = new ParentingUpdater(eventBus);
    this.positionUpdater = new PositionUpdater(eventBus);
    this.renderer = new Renderer(eventBus, system.canvasElement, camera);
    this.inputManager = new InputManager(eventBus, system.mouse, camera, passengerContainmentManager);
    this.seekingProcessor = new SeekingProcessor(eventBus);
    this.passengerSpawner = new PassengerSpawner(this.creator, eventBus);
    this.behavior = new Behavior(eventBus);
    this.flightPreviewManager = new FlightPreviewManager(eventBus, this.creator);
    this.hitFinder = new HitFinder(eventBus, camera);
    this.steeringProcessor = new SteeringProcessor(eventBus);
    this.winMonitor = new WinMonitor(eventBus);

    LevelCreator['createLevel' + this.levelCount](this.creator);

    eventBus.subscribe('loss', this.handleLoss, this);
    eventBus.subscribe('win', this.handleWin, this);
  }

  PlayState.prototype = {
    enter: function() { },
    exit: function() {
      this.mouseEventDelegation.shutdown();
      this.eventBus.unsubscribe('loss', this.handleLoss, this);
      this.eventBus.unsubscribe('win', this.handleWin, this);
    },
    handleLoss: function(event) {
      this.outcome = 'loss';
    },
    handleWin: function(event) {
      this.outcome = 'win';
    },
    update: function(timeDelta) {
      this.checkOutcome();
      this.database.update();
      this.passengerSpawner.update(timeDelta);
      this.hitFinder.update();
      this.inputManager.update();
      this.passengerContainmentManager.update();
      this.parentingUpdater.update();
      this.flightPreviewManager.update();
      if(this.levelCount !== 1) this.patienceProcessor.update(timeDelta);
      this.behavior.update(timeDelta);
      this.dockingRegistry.update();
      this.winMonitor.update();
      this.positionUpdater.update();
      this.steeringProcessor.update(timeDelta);
      this.seekingProcessor.update(timeDelta);
      this.renderer.draw();
      this.tutor.update();
    },
    checkOutcome: function() {
      var nextState;
      switch(this.outcome) {
        case "loss":
          nextState = new LoseState(this.system, this.levelCount);
          break;
        case "win":
          nextState = new WinState(this.system, this.levelCount);
          break;
      }
      if(nextState) {
        var event = {
          type: 'stateChangeRequest',
          state: nextState
        };
        this.system.eventBus.emit(event);
      }
    }
  };

  return PlayState;
});

define(['lib/odin/transformation2d_aspect', 'lib/blaise/vector2'], function(Transformation2DAspect, Vector2) {
  function Creator(database, passengerContainmentManager, dockingRegistry) {
    this.database = database;
    this.passengerContainmentManager = passengerContainmentManager;
    this.dockingRegistry = dockingRegistry;
  }

  Creator.prototype = {
    createPassenger: function(originPlanet, destinationPlanet) {
      var passenger = this.database.createEntity();

      var color = destinationPlanet.aspects.shapeRendering.color;
      var radius = 1;
      passenger.addAspect('shapeRendering', { color: color, type: 'circle', radius: radius });

      passenger.addAspect('transformation2D', new Transformation2DAspect());

      passenger.addAspect('parenting', { parent: originPlanet })

      passenger.addAspect('seeking', { target: Vector2.zero(), active: true });
      passengerAspect = passenger.addAspect('passenger', { destination: destinationPlanet, patience: 1 });

      passenger.addAspect('hitCircle', { radius: radius });

      this.passengerContainmentManager.insert(passenger, originPlanet);
    },
    createPlanet: function(x, y, color, passengerInterval, passengerCount) {
      var radius = 6;
      var planet = this.database.createEntity();

      planet.addAspect('planet', {
        radius: radius,
        waitingList: [],
        passengerInterval: passengerInterval,
        passengerCount: passengerCount
      });
      planet.addAspect('passengerContainer', { list: [] });
      planet.addAspect('shapeRendering', { color: color, type: 'circle', radius: radius });

      var transformationAspect = new Transformation2DAspect();
      transformationAspect.move(new Vector2(x, y));
      planet.addAspect('transformation2D', transformationAspect);

      planet.addAspect('hitCircle', { radius: radius });

      return planet;
    },
    createShip: function(planet) {
      var ship = this.database.createEntity();

      ship.addAspect('shapeRendering', { type: 'triangle', size: 8, color: "transparent" });
      var transformationAspect = new Transformation2DAspect();
      transformationAspect.rotate(Math.PI*0.5);
      ship.addAspect('transformation2D', transformationAspect);
      ship.addAspect('hitCircle', { radius: 3 });
      ship.addAspect('parenting', { parent: planet });
      ship.addAspect('ship');
      ship.addAspect('passengerContainer', { list: [] });
      ship.addAspect('steering');
      ship.addAspect('seeking', { active: false });

      this.dockingRegistry.bind(ship, planet);
    },
    createFlightPreview: function(ship, target) {
      var preview = this.database.createEntity();
      preview.addAspect('flightPreview', { ship: ship, target: target });
      return preview;
    }
  };

  return Creator;
});

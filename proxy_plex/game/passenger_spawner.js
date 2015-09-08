define(['lib/blaise/vector2', 'lib/random_generator'], function(Vector2, RandomGenerator) {
  function PassengerSpawner(creator, eventBus) {
    this.creator = creator;
    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    this.planets = [];
    this.planetSpawners = [];
    this.randomGenerator = new RandomGenerator(123456);
  }

  PassengerSpawner.prototype = {
    update: function(timeDelta) {
      this.planetSpawners.forEach(function(spawner) {
        spawner.update(timeDelta);
      })
    },
    handleEntityCreation: function(entityCreationEvent) {
      var entity = entityCreationEvent.entity;
      if(entity.aspects.planet) {
        this.planets.push(entity);
        if(entity.aspects.planet.passengerCount !== 0) {
          var spawner = new PlanetPassengerSpawner(entity, this.planets, this.creator, this.randomGenerator);
          this.planetSpawners.push(spawner);
        }
      }
    }
  };

  function PlanetPassengerSpawner(planet, planets, creator, randomGenerator) {
    this.planet = planet;
    this.planets = planets;
    this.creator = creator;
    this.interval = planet.aspects.planet.passengerInterval;
    this.passengersLeft = planet.aspects.planet.passengerCount;
    this.timeout = this.interval*0.1;
    this.randomGenerator = randomGenerator;
  }

  PlanetPassengerSpawner.prototype = {
    update: function(timeDelta) {
      if(this.passengersLeft === 0) return;
      this.timeout -= timeDelta;
      if(this.timeout <= 0) {
        this.timeout += this.interval;
        this.creator.createPassenger(this.planet, this.findDestinationPlanet());
        this.passengersLeft -= 1;
      }
    },
    findDestinationPlanet: function() {
      var ownIndex = this.planets.indexOf(this.planet);
      var index;
      var guard = 0;
      while(1) {
        index = Math.floor(this.randomGenerator.get()*this.planets.length);
        if(index != ownIndex) break;
        if(guard++ === 100) throw new Exception("Could not find destination planet.");
      }
      return this.planets[index];
    }
  };

  return PassengerSpawner;
});

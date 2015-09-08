define(function() {
  var LevelCreator = {
    createLevel1: function(creator) {
      var leftPlanet = creator.createPlanet(-15, 0, 'red', 2000, 3);
      var rightPlanet = creator.createPlanet(15, 0, 'blue', 0, 0);

      creator.createShip(leftPlanet);
    },
    createLevel2: function(creator) {
      var leftPlanet = creator.createPlanet(-15, 0, 'yellow', 2000, 1);
      var rightPlanet = creator.createPlanet(15, 0, 'green', 0, 0);
      var bottomPlanet = creator.createPlanet(0, -10, 'blue', 3000, 1);

      creator.createShip(leftPlanet);
    },
    createLevel3: function(creator) {
      var leftPlanet = creator.createPlanet(-15, 0, 'yellow', 2000, 6);
      var rightPlanet = creator.createPlanet(15, 0, 'red', 0, 0);

      creator.createShip(leftPlanet);
    },
    createLevel4: function(creator) {
      var topLeftPlanet = creator.createPlanet(-12.1, 12, 'yellow', 10000, 4);
      var toprightPlanet = creator.createPlanet(12.1, 12.1, 'green', 0, 0);
      var bottomLeftPlanet = creator.createPlanet(-11.5, -12.2, 'blue', 4000, 10);
      var bottomRightPlanet = creator.createPlanet(11.8, -11.9, 'red', 16000, 3);

      creator.createShip(topLeftPlanet);
      creator.createShip(bottomRightPlanet);
    },
    createLevel5: function(creator) {
      var topPlanet = creator.createPlanet(12, 12, 'green', 10000, 8);
      var rightPlanet = creator.createPlanet(24, 0, 'blue', 6000, 10);

      var leftPlanet = creator.createPlanet(-24, 0, 'yellow', 12000, 10);
      var bottomPlanet = creator.createPlanet(-12, -12, 'red', 0, 0);

      creator.createShip(bottomPlanet);
    }
  };

  return LevelCreator;
});

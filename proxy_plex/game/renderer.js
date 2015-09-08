define(['./transformation_helper', 'lib/blaise/matrix3', 'lib/blaise/vector3'], function(TransformationHelper, Matrix3, Vector3) {
  var colors = {
    green: '#65b55b',
    red: '#c54a4a',
    yellow: '#f0b028',
    blue: '#2b74cf',
    transparent: 'rgba(0, 0, 0, 0.4)'
  };

  function Renderer(eventBus, canvasElement, camera) {
    this.canvasElement = canvasElement;
    this.context = canvasElement.getContext('2d');

    eventBus.subscribe('entityCreation', this.handleEntityCreation, this);
    eventBus.subscribe('entityRemoval', this.handleEntityRemoval, this);

    this.entities = [];

    // hack, shouldn't be using the style property to back resolution config
    this.resolutionZoom = parseInt(canvasElement.style.height);
    this.camera = camera;
  }

  Renderer.prototype = {
    draw: function() {
      this.clear();
      this.context.save();
      var scale = this.resolutionZoom/this.camera.zoom;
      this.context.scale(scale, scale*-1);

      this.drawEntities();
      if(this.flightPreview) this.drawFlightPreview();

      this.context.restore();
    },
    drawEntities: function() {
      this.entities.forEach(function(entity) {
        var aspects = entity.aspects;
        var transformationAspect = aspects.transformation2D;
        var size = 80;
        this.context.save();

        var matrix = TransformationHelper.resolveWorldMatrix(entity);
        this.context.transform(
          matrix.get(0),
          matrix.get(1),
          matrix.get(3),
          matrix.get(4),
          matrix.get(6),
          matrix.get(7)
        );

        var renderingAspect = aspects.shapeRendering;
        this.context.fillStyle = colors[renderingAspect.color];
        switch(renderingAspect.type) {
          case "circle":
            this.context.beginPath();
            this.context.arc(0, 0, renderingAspect.radius, 0, 2*Math.PI);
            this.context.fill();
            if(entity.aspects.passenger) {
              this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
              this.context.beginPath();
              this.context.arc(0, 0, renderingAspect.radius*(0.2 + 0.8*(1-entity.aspects.passenger.patience)), 0, 2*Math.PI);
              this.context.fill();
            }
            break;
          case "triangle": {
            var size = renderingAspect.size;
            var height = (Math.sqrt(3)/2)*size;
            var displacementHack = height*0.17;
            this.context.beginPath();
            this.context.moveTo(-height*0.5+displacementHack, size*0.5);
            this.context.lineTo(-height*0.5+displacementHack, -size*0.5);
            this.context.lineTo(height*0.5+displacementHack, 0);
            this.context.fill();
            break;
          }
        }

        this.context.restore();
      }.bind(this));
    },
    drawFlightPreview: function() {
      var ship = this.flightPreview.aspects.flightPreview.ship;
      var worldMatrix = TransformationHelper.resolveWorldMatrix(ship);
      var startPosition = Matrix3.multiplyVector(worldMatrix, new Vector3(0, 0, 1));
      var endPosition = this.flightPreview.aspects.flightPreview.target;
      this.context.beginPath();
      this.context.moveTo(startPosition.get(0), startPosition.get(1));
      this.context.lineTo(endPosition.get(0), endPosition.get(1));
      this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.context.lineWidth = 1;
      this.context.setLineDash([1, 1]);
      this.context.stroke();
    },
    handleEntityCreation: function(creationEvent) {
      var entity = creationEvent.entity;
      var aspects = entity.aspects;
      if(aspects.shapeRendering) {
        this.entities.push(entity);
      }
      else if(aspects.flightPreview) {
        if(this.flightPreview) throw new Error("Can only handle one flight preview.");
        this.flightPreview = entity;
      }
    },
    handleEntityRemoval: function(removalEvent) {
      var entity = removalEvent.entity;
      var aspects = entity.aspects;
      if(aspects.shapeRendering) {
        var index = this.entities.indexOf(entity);
        if(index === -1) throw new Error("Cannot remove entity from renderer.");
        this.entities.splice(index, 1);
      }
      else if(aspects.flightPreview) {
        delete this.flightPreview;
      }
    },
    clear: function() {
      this.context.fillStyle = '#fff';
      this.context.fillRect(-this.canvasElement.width*0.5, -this.canvasElement.height*0.5, this.canvasElement.width, this.canvasElement.height);
    }
  };

  return Renderer;
});

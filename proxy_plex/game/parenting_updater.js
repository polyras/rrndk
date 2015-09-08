define(['./transformation_helper', 'lib/blaise/matrix3', 'lib/blaise/vector2', 'lib/blaise/vector3'], function(TransformationHelper, Matrix3, Vector2, Vector3) {
  function ParentingUpdater(eventBus) {
    eventBus.subscribe('parentSetRequest', this.storeRequest, this);
    eventBus.subscribe('parentUnsetRequest', this.storeRequest, this);
    this.pendingRequestEvents = [];
  }

  ParentingUpdater.prototype = {
    update: function() {
      this.pendingRequestEvents.forEach(function(event) {
        var childTransformationAspect = event.entity.aspects.transformation2D;
        var parentTransformationAspect;

        if(event.type === 'parentSetRequest') {
          var childWorldMatrix = TransformationHelper.resolveWorldMatrix(event.entity);
          var worldParentMatrix = TransformationHelper.resolveInverseWorldMatrix(event.parent);
          var childParentMatrix = Matrix3.multiplyMatrix(worldParentMatrix, childWorldMatrix);
          var relativePosition = new Vector2(childParentMatrix.get(6), childParentMatrix.get(7));
          childTransformationAspect.position.set(relativePosition);
          event.entity.aspects.parenting.parent = event.parent;
        } else {
          parentTransformationAspect = event.entity.aspects.parenting.parent.aspects.transformation2D;
          childTransformationAspect.position.add(parentTransformationAspect.position);
          delete event.entity.aspects.parenting.parent;
        }
      });
      this.pendingRequestEvents.length = 0;
    },
    storeRequest: function(requestEvent) {
      this.pendingRequestEvents.push(requestEvent);
    }
  };

  return ParentingUpdater;
});

var PointConverter = {
  worldToEditor: function(worldPoint, screen) {
    var editorPoint = Voy.Vector2.subtract(worldPoint, screen.position);
    return UnitConverter.worldToEditor(editorPoint);
  },
  editorToWorld: function(editorPoint, screen) {
    var worldPoint = UnitConverter.editorToWorld(editorPoint);
    worldPoint.add(screen.position);
    return worldPoint;
  }
};

var UnitConverter = {
  scale: 3,
  worldToEditor: function(worldPoint) {
    var result = Voy.Vector2.divide(worldPoint, this.scale);
    result.round();
    return result;
  },
  editorToWorld: function(editorPoint) {
    var result = Voy.Vector2.multiply(editorPoint, this.scale);
    result.round();
    return result;
  }
};

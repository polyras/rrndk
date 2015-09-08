define(['lib/valhalla/entity'], function(Entity) {
  function Database(eventBus) {
    this.eventBus = eventBus;
    this.entityCreations = [];
    this.entityRemovals = [];
    this.aspectInsertions = [];
  }

  Database.prototype = {
    update: function() {
      this.entityRemovals.forEach(function(entity) {
        var event = { type: 'entityRemoval', entity: entity };
        this.eventBus.emit(event);
      }.bind(this));
      this.entityRemovals.length = 0;

      this.entityCreations.forEach(function(entity) {
        var event = { type: 'entityCreation', entity: entity };
        this.eventBus.emit(event);
      }.bind(this));
      this.entityCreations.length = 0;
    },
    createEntity: function() {
      var entity = new Entity(this);
      this.entityCreations.push(entity);
      return entity;
    },
    removeEntity: function(entity) {
      if(this.entityRemovals.indexOf(entity) === -1) {
        this.entityRemovals.push(entity);
      }
    },
    handleAspectCreation: function(entity) {
      // noop for now
    }
  };

  return Database;
});

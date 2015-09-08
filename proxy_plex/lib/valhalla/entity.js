define(function() {
  function Entity(database) {
    this.database = database;
    this.aspects = {};
  }

  Entity.prototype = {
    addAspect: function(type, aspect) {
      if(!aspect) aspect = {};
      if(this.aspects[type]) throw new Error("Already has aspect.");
      this.aspects[type] = aspect;
      this.database.handleAspectCreation(this);
    },
    remove: function() {
      this.database.removeEntity(this);
    }
  };

  return Entity;
});

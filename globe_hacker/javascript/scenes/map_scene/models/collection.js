(function() {
  function Collection() {
    this.list = []
  }

  Collection.prototype = {
    add: function(entity) {
      this.list.push(entity)
    },
    forEach: function(callback) {
      this.list.forEach(callback)
    },
    findAll: function(test) {
      return this.list.filter(test)
    },
    every: function(test) {
      return this.list.every(test)
    },
    findById: function(id) {
      return this.find(function(entity) {
        return id === entity.id
      })
    },
    update: function(timeDelta) {
      this.forEach(function(entity) {
        entity.update(timeDelta)
      })
    },
    find: function(test) {
      var result
      this.list.some(function(entity) {
        if(test(entity)) {
          result = entity
          return true
        }
      })
      return result
    },
    remove: function(entity) {
      var index = this.list.indexOf(entity)
      if(index == -1) throw new Error('Cannot remove entity. It does not exist in collection.')
      this.list.splice(index, 1)
    }
  }

  MapScene.Collection = Collection
})()

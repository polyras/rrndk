(function() {
  // WARNING THIS CODE IS SHIIIIT! Cover your eyes!
  // Needs a total rewrite preferable using the Floyd–Warshall algorithm.

  function PathFinder(subject, target) {
    this.entities = subject.findConnectedMainframes()

    this.subject = subject
    this.nodesByEntityName = {}
    this.entities.forEach(function(entity) {
      this.findOrCreateNode(entity)
    }.bind(this))

    this.startNode = this.findNode(subject)
    this.startNode.distance = 0
    this.destinationNode = this.findNode(target)

    this.unvisitedNodes = this.getNodes()
  }

  PathFinder.prototype = {
    execute: function() {
      if(!this.destinationNode) return
      this.currentNode = this.getUnvisitedNodeWithShortestDistance()
      if(this.currentNode.distance == Infinity) return

      if(true) {
        var unvisitedNeighbours = this.currentNode.neighbours.filter(function(neighbour) {
          return !neighbour.visited
        })
        unvisitedNeighbours.forEach(function(unvisitedNeighbour) {
          var link = this.currentNode.entity.findLinkTo(unvisitedNeighbour.entity)
          var newDistance = link.length + this.currentNode.distance
          if(newDistance < unvisitedNeighbour.distance && (unvisitedNeighbour.entity.commander == this.subject.commander || unvisitedNeighbour == this.destinationNode)) {
            unvisitedNeighbour.distance = newDistance
          }
        }.bind(this))
      }

      this.currentNode.visited = true
      this.unvisitedNodes.splice(this.unvisitedNodes.indexOf(this.currentNode), 1)
      if(this.destinationNode.visited)
        this.finalize()
      else
        this.execute()
    },
    getNodes: function() {
      var result = []
      var node
      for(var entityName in this.nodesByEntityName) {
        result.push(this.nodesByEntityName[entityName])
      }
      return result
    },
    getUnvisitedNodeWithShortestDistance: function() {
      var node, result
      for(var i=0; this.unvisitedNodes.length>i; i++) {
        node = this.unvisitedNodes[i]
        if(!result || result.distance > node.distance) result = node
      }
      return result
    },
    findOrCreateNode: function(entity) {
      var node = this.findNode(entity)
      if(node) return node
      this.addNode(entity)
      return this.findNode(entity)
    },
    addNode: function(entity) {
      var node = {
        distance: Infinity,
        neighbours: [],
        visited: false,
        entity: entity
      }
      this.nodesByEntityName[entity.name] = node
      var entityNeighbours = entity.findNeighbours()
      entityNeighbours.forEach(function(entityNeighbour) {
        if(this.entities.indexOf(entityNeighbour) != -1) {
          var nodeNeighbour = this.findOrCreateNode(entityNeighbour)
          node.neighbours.push(nodeNeighbour)
        }
      }.bind(this))
    },
    findNode: function(entity) {
      return this.nodesByEntityName[entity.name]
    },
    finalize: function() {
      var path = []
      var node = this.destinationNode
      while(1) {
        path.push(node.entity)
        if(node == this.startNode) break
        var bestNeighbourNode
        node.neighbours.forEach(function(neighbourNode) {
          if(!bestNeighbourNode || bestNeighbourNode.distance > neighbourNode.distance) 
            bestNeighbourNode = neighbourNode
        })
        node = bestNeighbourNode
      }
      this.result = path.reverse()
    }
  }

  MapScene.PathFinder = PathFinder
})()

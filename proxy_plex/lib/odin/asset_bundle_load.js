define(['lib/valhalla/event_bus', 'lib/odin/image_load'], function(EventBus, ImageLoad) {
  var parallelCount = 2;
  var supportedExtensions = ['png'];

  function getExtension(path) {
    var pathParts = path.split('/');
    filename = pathParts[pathParts.length-1];
    var filenameParts = filename.split('.');
    if(filenameParts.length == 1) throw new Exception('Filename must have an extension.');
    return filenameParts[filenameParts.length-1];
  }

  function AssetBundleLoad(assetRegistry, eventBus) {
    this.assetRegistry = assetRegistry;
    this.pendingPaths = [];
    this.activePaths = [];
    this.executing = false;
    this.externalEventBus = eventBus;
    this.internalEventBus = new EventBus();
    this.internalEventBus.subscribe('loadCompletion', this.handleCompletion, this);
  }

  AssetBundleLoad.prototype = {
    add: function(path) {
      if(this.executing) throw new Error('Cannot add while executing.');
      var extension = getExtension(path);
      if(supportedExtensions.indexOf(extension) === -1) throw new Exception("Asset type not supported (" + extension + ").");
      this.pendingPaths.push(path);
    },
    execute: function() {
      this.executing = true;
      var count = Math.min(parallelCount, this.pendingPaths.length);
      for(var i=0; count>i; i++) {
        this.loadNext();
      }
    },
    loadNext: function() {
      var path = this.pendingPaths.pop();
      this.activePaths.push(path);
      var load = this.createLoad(path);
      load.execute();
    },
    createLoad: function(path) {
      var extension = getExtension(path);
      var load;
      if(extension == 'png') {
        load = new ImageLoad(this.internalEventBus, path);
      }
      return load;
    },
    handleCompletion: function(completionEvent) {
      var path = completionEvent.path;
      var index = this.activePaths.indexOf(path);
      if(index === -1) throw new Error("Path for completed asset not found.");
      this.activePaths.splice(index, 1);
      this.assetRegistry.add(path, completionEvent.asset);

      if(this.pendingPaths.length != 0) {
        this.loadNext();
      }
      else if(this.activePaths.length == 0) {
        var event = {
          type: 'assetBundleLoadCompletion'
        }
        this.externalEventBus.emit(event);
      }
    }
  };

  return AssetBundleLoad;
});

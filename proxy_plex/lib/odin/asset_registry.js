define(function() {
  function AssetRegistry() {
    this.map = {};
  }

  AssetRegistry.prototype = {
    add: function(path, asset) {
      if(this.map[path]) throw new Exception("Asset already in registry.");
      this.map[path] = asset;
    },
    get: function(path) {
      var asset = this.map[path];
      if(!asset) throw new Error("Asset not found (" + path + ").");
      return asset;
    }
  };

  return AssetRegistry;
});

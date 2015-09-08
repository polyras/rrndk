(function() {
  function initialize() {
    var editor = new Editor();
    document.body.appendChild(editor.getCanvasElement());
    document.body.appendChild(editor.getTextAreaElement());
    editor.run();
  }
  window.addEventListener('load', initialize);
})();

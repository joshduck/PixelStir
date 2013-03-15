var BaseEditor = new Class({

  Implements: Events,

  initialize: function(viewer) {
    this.viewer = viewer;
    this.photo = null;
    this.editorNode = null;
    this.actionsNode = null;
  },

  show: function() {
    this.editorNode && UI.show(this.editorNode);
    this.actionsNode && UI.show(this.actionsNode);
  },

  hide: function() {
    this.editorNode && UI.hide(this.editorNode);
    this.actionsNode && UI.hide(this.actionsNode);
  },

  setPhoto: function(photo) {
    this.photo = photo;
  },

  processPreview: function() {
    return true;
  },

  handleKey: function(key) {
    return false;
  }
});

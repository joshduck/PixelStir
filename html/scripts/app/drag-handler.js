var DragHandler = new Class({

  Implements: Events,

  initialize: function() {
    this.app = App.getInstance();
    this.listening = false;
    this.initEvents();
  },

  initEvents: function() {
    this.app.addEvent('authenticate', this.attachListeners.bind(this));
    this.app.addEvent('deauthenticate', this.detachListeners.bind(this));
  },

  attachListeners: function() {
    this.listening = true;

    document.addEventListener("dragover", function(e) {
      if (this.listening) {
        e.dataTransfer.dropEffect == "move" && e.preventDefault();
      }
    }.bind(this), true);

    document.addEventListener("drop", function(e) {
      if (this.listening) {
        e.preventDefault();
        this.fireEvent('files', {files: Array.from(e.dataTransfer.files)});
      }
    }.bind(this), false);

    document.addEventListener("dragenter", function(e) {
      if (this.listening) {
        e.dataTransfer.dropEffect == "move" && e.preventDefault();
      }
    }.bind(this), false);
  },

  detachListeners: function() {
    this.listening = false;
  }
});

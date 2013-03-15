var PreviewEditor = new Class({

  Extends: BaseEditor,

  Implements: Events,

  initialize: function(viewer) {
    this.parent(viewer);

    this.initComponents();
    this.initEvents();
  },

  initComponents: function() {
    this.previewEdit = $('previewEdit');
    this.nameInput = $('previewName');

    this.editorNode = previewEdit;
    this.actionsNode = null;
  },

  initEvents: function() {
    this.nameInput.addEvent('change', this.changeInput.bind(this));
  },

  setPhoto: function(photo) {
    this.parent(photo);
    this.nameInput.value = photo ? photo.name : "";
  },

  changeInput: function() {
    if (this.photo) {
      this.photo.name = this.nameInput.value;
    }
  },

  handleKey: function(key) {
    if (document.activeElement == this.nameInput) {
      if (key == "enter") {
        this.nameInput.blur();
      }
      return true;
    }
  }

});

const BaseScreen = require("./base-screen");
const PhotoThumb = require("./photo-thumb");
const UI = require("../ui");

module.exports = new Class({
  Extends: BaseScreen,

  Implements: Events,

  initialize: function(node, collection) {
    this.parent(node);

    this.collection = collection;
    this.thumbs = [];
    this.selected = null;

    this.initControls();
    this.initThumbs();
    this.initEvents();
  },

  initControls: function() {
    this.thumbContainer = $("thumbContainer");
    this.thumbTemplate = $("thumbTemplate");
    this.uploadButton = $("uploadButton");
    this.clearButton = $("clearButton");
  },

  initThumbs: function() {
    this.thumbContainer.removeChild(this.thumbTemplate);
    UI.show(this.thumbTemplate);
  },

  initEvents: function() {
    this.collection.addEvent("add", this.add.bind(this));
    this.collection.addEvent("remove", this.remove.bind(this));
    this.uploadButton.addEvent("click", this.app.upload.bind(this.app));
    this.clearButton.addEvent(
      "click",
      this.collection.reset.bind(this.collection)
    );
  },

  createThumbNode: function() {
    var node = this.thumbTemplate.cloneNode(true);
    node.id = null;
    return node;
  },

  add: function(photo) {
    var node = this.createThumbNode();
    var thumb = new PhotoThumb(node, photo);

    photo.addEvent("remove", this.remove.bind(this, thumb));
    thumb.addEvent("select", this.select.bind(this, thumb));

    this.thumbContainer.appendChild(node);
    this.thumbs.push(thumb);
    this.selected || this.select(thumb);
  },

  remove: function(thumb) {
    this.thumbContainer.removeChild(thumb.node);

    if (this.selected == thumb) {
      if (this.thumbs.length > 1) {
        this.selectLast();
      } else {
        this.select(null);
      }
    }

    var index = this.thumbs.indexOf(thumb);
    if (index !== -1) {
      this.thumbs.splice(index, 1);
    }
  },

  select: function(thumb) {
    this.selected && this.selected.showUnselected();
    this.selected = thumb;
    this.selected && this.selected.showSelected();
    this.fireEvent("select", thumb ? thumb.photo : null);
  },

  selectLast: function() {
    var index = this.thumbs.indexOf(this.selected);
    var last = index <= 0 ? this.thumbs.length - 1 : index - 1;
    this.select(this.thumbs[last]);
  },

  selectNext: function() {
    var index = this.thumbs.indexOf(this.selected);
    var next = index == -1 || index + 1 >= this.thumbs.length ? 0 : index + 1;
    this.select(this.thumbs[next]);
  },

  toggleSelected: function() {
    this.selected && this.selected.toggleUpload();
  },

  handleKey: function(key) {
    switch (key) {
      case "space":
        this.toggleSelected();
        return true;
      case "left":
        this.selectLast();
        return true;
      case "right":
        this.selectNext();
        return true;
    }
    return false;
  }
});

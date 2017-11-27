const PhotoModel = require("./photo-model");

module.exports = new Class({
  Implements: Events,

  initialize: function() {
    this.photos = [];
    this.name = new Date().toDateString();
    this.id = null;
  },

  reset: function() {
    while (this.photos.length) {
      this.photos[0].remove();
    }
  },

  remove: function(photo) {
    var index = this.photos.indexOf(photo);
    if (index !== -1) {
      this.photos.splice(index, 1);
    }
  },

  hasUnsaved: function() {
    return this.photos.some(function(photo) {
      return photo.id == null;
    });
  },

  addList: function(info) {
    info.files.each(this.addFile.bind(this));
  },

  addFile: function(file) {
    if (/^image\/.*/.test(file.type)) {
      return this._createPhoto(file);
    }
  },

  addImage: function(image) {
    return this._createPhoto(image);
  },

  _createPhoto: function(data) {
    var photo = new PhotoModel(data);
    photo.addEvent("remove", this.remove.bind(this, photo));
    this.photos.push(photo);
    this.fireEvent("add", photo);
    return photo;
  }
});

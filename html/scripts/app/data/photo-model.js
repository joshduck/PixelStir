var PhotoModel = new Class({

  Implements: Events,

  initialize: function(input) {
    this.data = null;
    this.image = null;
    this.loader = new ImageLoader(this, input);
    this.filter = null;
    this.crop = null;

    this.filename = null;
    this.name = null;
    this.id = null;

    if (input instanceof HTMLImageElement) {
      this.filename = input.src;
    } else if (input instanceof File) {
      this.filename = input.name || input.fileName;
    }

    this.upload = false;
  },

  remove: function() {
    this.fireEvent('remove');
  },

  uploading: function() {
    this.fireEvent('uploading');
  },

  uploaded: function(id) {
    this.id = id;
    this.fireEvent('uploaded');
  }
});

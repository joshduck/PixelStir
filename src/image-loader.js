const ImageRenderer = require("./image-renderer");

var ImageLoader = new Class({
  Implements: Events,

  initialize: function(photo, input) {
    this.photo = photo;
    this.input = input;
    this.original = null;
    this.sized = null;

    this.callbacks = {
      data: [],
      original: [],
      sized: []
    };
  },

  //  Get data URL for image.
  loadData: function(callback) {
    if (this.photo.data) {
      callback && callback(this.photo.data);
    }

    this.callbacks.data.push(callback);
    if (this.callbacks.data.length == 1) {
      if (this.input instanceof File) {
        this._loadDataFromFile();
      } else if (this.input instanceof HTMLImageElement) {
        this._loadDataFromImage();
      }
    }
  },

  // Get original image.
  loadOriginal: function(callback) {
    if (this.original && this.original.src) {
      callback && callback(this.original);
    }

    this.callbacks.original.push(callback);
    if (this.callbacks.original.length == 1) {
      // TODO: handle just having this.data here
      // and in loadData().
      if (this.input instanceof File) {
        this._loadOriginalFromFile();
      } else if (this.input instanceof HTMLImageElement) {
        this.original = this.input;
        this.resolve(this.callbacks.original, this.original);
      }
    }
  },

  // Get resized canvas.
  loadSized: function(callback) {
    if (this.sized) {
      callback && callback(this.sized);
    }

    this.callbacks.sized.push(callback);
    if (this.callbacks.sized.length == 1) {
      this.loadOriginal(
        function(original) {
          var renderer = new ImageRenderer(original);
          renderer.setMaximumDimensions(
            ImageLoader.SIZED_WIDTH,
            ImageLoader.SIZED_HEIGHT
          );
          renderer.renderToCanvas(
            function(canvas) {
              this.sized = canvas;
              this.resolve(this.callbacks.sized, this.sized);
            }.bind(this)
          );
        }.bind(this)
      );
    }
  },

  // Respond to pending callbacks.
  resolve: function(callbacks, data) {
    callbacks.each(function(callback) {
      callback && callback(data);
    });
  },

  // Get data URI from filysystem object.
  _loadDataFromFile: function() {
    var reader = new FileReader();
    reader.onload = function(e) {
      this.photo.data = e.target.result;
      this.resolve(this.callbacks.data, this.photo.data);
    }.bind(this);
    reader.readAsDataURL(this.input);
  },

  // Get data URI from image element
  _loadDataFromImage: function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.input.width;
    canvas.height = this.input.height;

    var context = canvas.getContext("2d");
    context.drawImage(this.input, 0, 0);
    this.photo.data = canvas.toDataURL();

    this.resolve(this.callbacks.data, this.photo.data);
  },

  //
  _loadOriginalFromFile: function() {
    this.loadData(
      function(data) {
        this.original = $(document.createElement("img"));
        this.original.addEvent(
          "load",
          function() {
            this.resolve(this.callbacks.original, this.original);
          }.bind(this)
        );
        this.original.src = data;
      }.bind(this)
    );
  }
});

ImageLoader.SIZED_WIDTH = 1024;
ImageLoader.SIZED_HEIGHT = 1024;

module.exports = ImageLoader;

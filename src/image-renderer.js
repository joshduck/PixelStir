const CropModel = require("./data/crop-model");

module.exports = new Class({
  Implements: Events,

  initialize: function(source) {
    this.source = source;
    this.filter = null;
    this.crop = null;
    this.canvas = null;
    this.width = null;
    this.height = null;

    this.setCrop();
    this.setFilter();
  },

  // Set dimentions the image should not exceed
  setMaximumDimensions: function(width, height) {
    this.width = width;
    this.height = height;
  },

  // Define a Caman filter
  setFilter: function(filter) {
    this.filter = filter;
  },

  // Crop
  setCrop: function(crop) {
    this.crop = crop || new CropModel().fill();
  },

  // Render source to a data URI and pass it to the callback
  renderToUri: function(callback) {
    this.renderToCanvas(function(canvas) {
      callback && callback(canvas.toDataURL());
    });
  },

  // Render source to a canbas object and pass back to calblack.
  // If canvas is not defined then one will be created.
  renderToCanvas: function(canvas, callback) {
    if (canvas instanceof HTMLCanvasElement) {
      this.canvas = canvas;
    } else {
      callback = canvas;
      this.canvas = $(document.createElement("canvas"));
    }

    this._drawCanvas();
    this._drawFilters(
      function() {
        callback && callback(this.canvas);
        this.canvas = null;
      }.bind(this)
    );
  },

  // Draw internal image element to canvas.
  _drawCanvas: function() {
    var ratio = this._calculateRatio();

    var sourceBox = this.crop.copy().multiply({
      x: this.source.width,
      y: this.source.height
    });

    var destBox = this.crop.copy().multiply({
      x: this.source.width * ratio,
      y: this.source.height * ratio
    });

    // Scale output
    this.canvas.width = destBox.width;
    this.canvas.height = destBox.height;

    // Draw the image.
    var context = this.canvas.getContext("2d");
    context.save();

    context.drawImage(
      this.source,
      sourceBox.x, // Source
      sourceBox.y,
      sourceBox.width,
      sourceBox.height,
      0, // Dest
      0,
      destBox.width,
      destBox.height
    );
  },

  // Apply filters to canvas
  _drawFilters: function(callback) {
    if (this.filter) {
      var caman = this._getCamanInstance();
      if (caman[this.filter]) {
        caman[this.filter]();
        caman.render(callback);
        return;
      }
    }
    callback();
  },

  // Get the caman instance. This does a little bit of sillyness to hack
  // around Caman, which assumes the canvas is always part of the DOM.
  _getCamanInstance: function() {
    var query = document.querySelector;
    try {
      document.querySelector = function() {
        return this.canvas;
      }.bind(this);
      var caman = Caman(null, this.canvas);
      document.querySelector = query;
      return caman;
    } catch (e) {
      document.querySelector = query;
      throw e;
    }
  },

  // Calculate scale factor for image based on max dimensions.
  _calculateRatio: function() {
    if (this.width !== null && this.height !== null) {
      var x = this.width / (this.source.width * this.crop.width);
      var y = this.height / (this.source.height * this.crop.height);

      return Math.min(x, y, 1);
    } else {
      return 1;
    }
  }
});

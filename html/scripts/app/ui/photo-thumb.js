var PhotoThumb = new Class({

  Implements: Events,

  initialize: function(node, photo) {
    this.node = node;
    this.photo = photo;

    this.initView();
    this.initEvents();
    this.renderThumb();
  },

  initView: function() {
    this.node.addClass('thumbLoading');
    this.toggleInput = $(this.node.getElementsByClassName('thumbToggle')[0]);
    this.thumbImage = $(this.node.getElementsByClassName('thumbImage')[0]);
    this.nameLabel = $(this.node.getElementsByClassName('thumbName')[0]);

    this.toggleInput.checked = this.photo.upload;
  },

  initEvents: function() {
    this.toggleInput.addEvent('click', this.propagateToggle.bind(this));
    this.photo.addEvent('uploading', this.showUploading.bind(this));
    this.photo.addEvent('uploaded', this.showUploaded.bind(this));
    this.node.addEvent('click', this.select.bind(this));
  },

  propagateToggle: function() {
    this.photo.upload = this.toggleInput.checked;
  },

  select: function() {
    this.fireEvent('select');
  },

  toggleUpload: function() {
    this.toggleInput.checked = !this.toggleInput.checked;
    this.propagateToggle();
  },

  showSelected: function() {
    this.node.addClass('thumbSelected');
  },

  showUnselected: function() {
    this.node.removeClass('thumbSelected');
  },

  showUploading: function() {
    this.toggleInput.disabled = true;
    this.node.addClass('thumbUploading');
  },

  showUploaded: function() {
    this.toggleInput.disabled = true;
    this.node.addClass('thumbUploaded');
  },

  renderThumb: function() {
    this.photo.loader.loadSized(function(canvas) {
      var renderer = new ImageRenderer(canvas);
      renderer.setMaximumDimensions(PhotoThumb.IMAGE_WIDTH, PhotoThumb.IMAGE_HEIGHT);
      renderer.renderToCanvas(this.thumbImage, function() {
        this.node.removeClass('thumbLoading');
      }.bind(this));
    }.bind(this));

    this.thumbImage.title = this.photo.filename;
  }
});

PhotoThumb.IMAGE_WIDTH = 160;
PhotoThumb.IMAGE_HEIGHT = 120;

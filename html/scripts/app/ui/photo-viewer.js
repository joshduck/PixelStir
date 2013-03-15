var PhotoViewer = new Class({

  Extends: BaseScreen,

  Implements: Events,

  initialize: function(node, collection) {
    this.parent(node);

    this.photo = null;
    this.mode = null;
    this.modes = {
      preview: new PreviewEditor(this),
      filter: new FilterEditor(this),
      crop: new CropEditor(this)
    };

    this.initComponents();
    this.initEvents();
    this.setMode();
    this.setPhoto();
  },

  initComponents: function() {
    this.instructionScreen = $('instructionScreen');
    this.previewScreen = $('previewScreen');
    this.modeGroup = $('editModes');
    this.modeButtons = $$('#editModes .uiButton');
    this.previewCanvas = $('previewFull');
    this.proxyCanvas = $('previewProxy');
  },

  initEvents: function() {
    this.app.addEvent('authenticate', this.show.bind(this));
    this.app.addEvent('deauthenticate', this.hide.bind(this));
    window.addEvent('resize', this.resizeCanvas.bind(this));

    this.eachMode(function(mode) {
      mode.addEvent('done', this.setMode.bind(this));
      mode.addEvent('update', this.showPhoto.bind(this, true));
    }.bind(this));

    this.modeButtons.each(function(button) {
      button.addEvent('click', this.setMode.bind(this, button.getAttribute('data-mode')));
    }.bind(this));
  },

  show: function() {
    this.eachMode(function(mode) {
      mode.hide();
    }.bind(this));
    this.mode.show();
    this.showScreens();
  },

  hide: function() {
    UI.hide(this.instructionScreen);
    UI.hide(this.previewScreen);
  },

  setMode: function(name) {
    var last = this.mode;
    var next = this.modes[name] || this.modes.preview;

    if (last !== next) {
      this.mode = next;
      this.show();
      this.showPhoto();
    }
  },

  eachMode: function(callback) {
    for (var name in this.modes) {
      callback(this.modes[name]);
    }
  },

  handleKey: function(key) {
    return this.mode.handleKey(key);
  },

  resizeCanvas: function() {
    this.fireEvent('resize');
  },

  setPhoto: function(photo) {
    this.photo = photo;
    this.photo || this.setMode();
    this.eachMode(function(mode) {
      mode.setPhoto(photo);
    });

    this.showScreens();
    this.showPhoto();
  },

  showScreens: function() {
    UI.toggle(this.modeGroup, this.photo);
    UI.toggle(this.previewScreen, this.photo);
    UI.toggle(this.instructionScreen, !this.photo);
  },

  showPhoto: function(force) {
    if (!this.photo) {
      return;
    }

    // Copy image from preview to proxy and then swap them.
    if (!UI.shown(this.proxyCanvas)) {
      this.proxyCanvas.height = this.previewCanvas.height;
      this.proxyCanvas.width = this.previewCanvas.width;

      var renderer = new ImageRenderer(this.previewCanvas);
      renderer.renderToCanvas(this.proxyCanvas);
      UI.show(this.proxyCanvas);
      UI.hide(this.previewCanvas);
    }

    // Render to preview and then swap back.
    this.photo.loader.loadSized(function(canvas) {
      var renderer = new ImageRenderer(canvas);
      // Rendering stylized?
      if (this.mode.processPreview()) {
        renderer.setFilter(this.photo.filter);
        renderer.setCrop(this.photo.crop);
      }
      renderer.renderToCanvas(this.previewCanvas, function() {
        UI.hide(this.proxyCanvas);
        UI.show(this.previewCanvas);
        this.fireEvent('resize');
      }.bind(this));
    }.bind(this));
  },
});

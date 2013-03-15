var CropEditor = new Class({

  Extends: BaseEditor,

  Implements: Events,

  initialize: function(viewer) {
    this.parent(viewer);

    this.dimensions = null;
    this.crop = null;
    this.changed = false;

    this.dragOffset = null;
    this.dragStart = null;
    this.dragMultiplier = null;

    this.initComponents();
    this.initEvents();
  },

  initComponents: function() {
    this.cropBoundary = $('cropBoundary');
    this.cropOutline = $('cropOutline');
    this.applyButton = $('cropApplyButton');
    this.cancelButton = $('cropCancelButton');
    this.resetButton = $('cropResetButton');
    this.handles = $$('#cropOutline .cropHandle');

    this.editorNode = this.cropBoundary;
    this.actionsNode = $('cropActions');
  },

  initEvents: function() {
    this.viewer.addEvent('resize', this.resizePreview.bind(this));
    this.cropOutline.addEvent('mousedown', this.mousedown.bind(this));
    this.applyButton.addEvent('click', this.applyCrop.bind(this));
    this.cancelButton.addEvent('click', this.cancelCrop.bind(this));
    this.resetButton.addEvent('click', this.resetCrop.bind(this));
    document.body.addEvent('mousemove', this.mousemove.bind(this));
    document.body.addEvent('mouseup', this.mouseup.bind(this));
  },

  processPreview: function() {
    return false;
  },

  setPhoto: function(photo) {
    this.parent(photo);
    this.dimensions = null;
    this.setCropFromPhoto();
  },

  applyCrop: function() {
    // TODO - regenerate sized image if the crop factor
    // is too far off.
    this.photo.crop = this.crop.copy();
    this.changed = false;
    this.drawOutline();
    this.fireEvent('done');
  },

  cancelCrop: function() {
    this.setCropFromPhoto();
    this.drawOutline();
    this.fireEvent('done');
  },

  resetCrop: function() {
    this.crop = new CropModel().fill();
    this.changed = true;
    this.drawOutline();
  },

  setCropFromPhoto: function() {
    this.crop = this.photo && this.photo.crop ?
      this.photo.crop.copy() :
      new CropModel().fill();
  },

  show: function() {
    this.parent();
    this.drawOutline();
  },

  mousedown: function(e) {
    this.dragStart = e.page;
    this.dragMultiplier = this._getDragMultiplier(e.target);
  },

  mousemove: function(e) {
    if (this.dragStart) {
      this.dragOffset = this._getDragOffset(e.page);
      this.drawOutline();
    }
  },

  mouseup: function(e) {
    if (this.dragOffset && this.dragMultiplier) {
      // Calculate drag distance
      var drag = this.dragMultiplier;
      drag.multiply(this.dragOffset);

      if (drag.hasVolume()) {
        // Convert to default scale (0 ... 1) and apply
        drag.divide(this.dimensions);
        this.crop.offset(drag);
        this.crop.constrain({x: 1, y: 1});
        this.changed = true;
      }
    }

    this.dragStart = null;
    this.dragOffset = null;
    this.dragMultiplier = null;

    this.drawOutline();
  },

  resizePreview: function() {
    this.dimensions = {
      x: this.viewer.previewCanvas.clientWidth,
      y: this.viewer.previewCanvas.clientHeight
    };

    this.cropBoundary.setStyles({
      marginLeft: (this.dimensions.x / -2) + 'px',
      width: this.dimensions.x + 'px',
      height: this.dimensions.y + 'px',
    });

    this.drawOutline();
  },

  drawOutline: function() {
    if (this.dimensions && this.photo && this.crop) {
      UI.show(this.cropOutline);

      var position = this.crop.copy().multiply(this.dimensions);

      // Apply dragging
      if (this.dragMultiplier) {
        var drag = this.dragMultiplier.copy();
        drag.multiply(this.dragOffset);
        position.offset(drag);
        position.constrain(this.dimensions);
      }

      this.cropOutline.setStyles({
        width: position.width + 'px',
        height: position.height + 'px',
        left: position.x + 'px',
        top: position.y + 'px'
      });
    } else {
      UI.hide(this.cropOutline);
    }
  },

  _getDragOffset: function(position) {
    return {
      x: position.x - this.dragStart.x,
      y: position.y - this.dragStart.y
    };
  },

  _getDragMultiplier: function(target) {
    var multiplier = new CropModel();
    if (!target.hasClass('cropHandle')) {
      multiplier.x = 1;
      multiplier.y = 1;
    } else {
      if (target.hasClass('handleN')) {
        multiplier.height = -2;
      } else if (target.hasClass('handleS')) {
        multiplier.height = 2;
      }

      if (target.hasClass('handleW')) {
        multiplier.width = -2;
      } if (target.hasClass('handleE')) {
        multiplier.width = 2;
      }
    }
    return multiplier;
  }
});

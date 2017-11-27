var CropModel = new Class({
  initialize: function() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  },

  fill: function() {
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
    return this;
  },

  hasVolume: function() {
    return this.x || this.y || this.width || this.height;
  },

  constrain: function(max) {
    this.width = Math.max(0, this.width);
    this.height = Math.max(0, this.height);

    if (max) {
      this.width = Math.min(max.x, this.width);
      this.height = Math.min(max.y, this.height);

      if (this.x + this.width > max.x) {
        this.x = max.x - this.width;
      } else if (this.x < 0) {
        this.x = 0;
      }

      if (this.y + this.height > max.y) {
        this.y = max.y - this.height;
      } else if (this.y < 0) {
        this.y = 0;
      }
    }

    return this;
  },

  copy: function() {
    var clone = new CropModel();
    clone.x = this.x;
    clone.y = this.y;
    clone.width = this.width;
    clone.height = this.height;
    return clone;
  },

  offset: function(other) {
    if (other.width || other.height) {
      other = other.copy();
      // Don't let negative width or height take the total past 0.
      if (other.width + this.width < 0) {
        other.width = -this.width;
      }
      if (other.height + this.height < 0) {
        other.height = -this.height;
      }

      // Move center, so that expanding equally effects adjacent sides.
      other.x -= other.width / 2;
      other.y -= other.height / 2;
    }

    return this.add(other);
  },

  add: function(other) {
    this.x += other.x;
    this.y += other.y;
    this.width += other.width;
    this.height += other.height;

    return this;
  },

  divide: function(scale) {
    this.x /= scale.x;
    this.y /= scale.y;
    this.width /= scale.x;
    this.height /= scale.y;
    return this;
  },

  multiply: function(scale) {
    this.x *= scale.x;
    this.y *= scale.y;
    this.width *= scale.x;
    this.height *= scale.y;
    return this;
  }
});

module.exports = CropModel;

var BaseScreen = new Class({
  initialize: function(node) {
    this.app = App.getInstance();
    this.node = node;
    this.align();
  },

  show: function() {
    UI.show(this.node);
    this.align();
  },

  hide: function() {
    UI.hide(this.node);
  },

  align: function() {
    if (this.node.hasClass('uiCentered')) {
      this.node.setStyles({
        marginLeft: -(this.node.offsetWidth / 2) + 'px',
        marginTop: -(100 + this.node.offsetHeight / 2) + 'px'
      });
    }
  }
});

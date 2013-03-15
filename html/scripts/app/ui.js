var UI = {
  hide: function(node) {
    node.addClass('uiHidden');
  },

  show: function(node) {
    node.removeClass('uiHidden');
  },

  toggle: function(node, shown) {
    shown ?
      node.removeClass('uiHidden') :
      node.addClass('uiHidden');
  },

  shown: function(node) {
    return !node.hasClass('uiHidden');
  }
};

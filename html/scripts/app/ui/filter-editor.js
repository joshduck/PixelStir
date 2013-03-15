var FilterEditor = new Class({

  Extends: BaseEditor,

  Implements: Events,

  initialize: function(viewer) {
    this.parent(viewer);

    this.initComponents();
    this.initEvents();
  },

  initComponents: function() {
    this.filterGroup = $('filterActions');
    this.filterButtons = $$('#filterActions .uiButton');

    this.editorNode = null;
    this.actionsNode = this.filterGroup;
  },

  initEvents: function() {
    this.filterButtons.each(function(button) {
      button.addEvent('click', this.setFilter.bind(this, button.getAttribute('data-filter')))
    }.bind(this));
  },

  setFilter: function(name) {
    if (this.photo.filter !== name) {
      this.photo.filter = name;
      this.fireEvent('update');
    }
  }
});

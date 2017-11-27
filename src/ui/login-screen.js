const BaseScreen = require("./base-screen");
const UI = require("../ui");

var LoginScreen = new Class({
  Extends: BaseScreen,

  initialize: function(node) {
    this.parent(node);
    this.loginButton = $("loginButton");
    this.closeButton = $("loginCloseButton");
    this.createTime = Date.now();
    this.initEvents();
  },

  initEvents: function() {
    this.loginButton.addEvent("click", this.app.tryAuthenticate.bind(this.app));
    this.closeButton.addEvent("click", this.hide.bind(this));
    this.app.addEvent("authenticate", this.authenticate.bind(this));
    this.app.addEvent("deauthenticate", this.deauthenticate.bind(this));
  },

  authenticate: function() {
    UI.hide(this.loginButton);
    UI.show(this.closeButton);

    var delay = Math.max(0, 2500 - Date.now() - this.createTime);
    window.setTimeout(this.hide.bind(this), delay);
  },

  deauthenticate: function() {
    UI.show(this.loginButton);
    UI.hide(this.closeButton);
    this.show();
  }
});

module.exports = LoginScreen;

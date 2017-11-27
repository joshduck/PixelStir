var PhotoCollection = require("./data/photo-collection");
var FileUploader = require("./file-uploader");
var LoginScreen = require("./ui/login-screen");
var PhotoDrawer = require("./ui/photo-drawer");
var PhotoViewer = require("./ui/photo-viewer");
var DragHandler = require("./drag-handler");

module.exports = new Class({
  Implements: Events,

  start: function() {
    this.initComponents();
    this.initEvents();
    this.initExample();
    this.checkAuthentication();

    this.authenticated = false;
    this.user = {};
  },

  initComponents: function() {
    this.photoCollection = new PhotoCollection();
    this.fileUploader = new FileUploader();

    this.loginScreen = new LoginScreen($("loginScreen"));
    this.photoDrawer = new PhotoDrawer($("photoDrawer"), this.photoCollection);
    this.photoViewer = new PhotoViewer($("photoViewer"));
    this.dragHandler = new DragHandler();
    this.logoLink = $("appLogo");
  },

  initEvents: function() {
    this.dragHandler.addEvent(
      "files",
      this.photoCollection.addList.bind(this.photoCollection)
    );
    this.photoDrawer.addEvent("select", this.selectPhoto.bind(this));
    $(window).addEvent("beforeunload", this.checkUnsaved.bind(this));
    $(window.document).addEvent("keyup", this.handleKey.bind(this));
    this.logoLink.addEvent(
      "click",
      this.loginScreen.show.bind(this.loginScreen)
    );
  },

  initExample: function() {
    var loadExample = function(name) {
      var image = $(document.createElement("img"));
      image.addEvent(
        "load",
        function() {
          this.photoCollection.addImage(image);
        }.bind(this)
      );
      image.src = "/static/images/examples/" + name;
    }.bind(this);

    loadExample("1.jpg");
    loadExample("2.jpg");
    loadExample("3.jpg");
  },

  selectPhoto: function(photo) {
    this.photoViewer.setPhoto(photo);
  },

  tryAuthenticate: function() {
    this.authenticated ||
      FB.login(
        function(response) {
          this.setAuthenticated(response.authResponse);
        }.bind(this),
        { scope: "email,user_photos,publish_stream" }
      );
  },

  checkAuthentication: function() {
    FB.getLoginStatus(
      function(response) {
        this.setAuthenticated(response.status === "connected");
      }.bind(this)
    );
  },

  setAuthenticated: function(authenticated) {
    if (this.authenticated != authenticated) {
      this.authenticated = authenticated;
      this.user = {};

      if (this.authenticated) {
        FB.api(
          "/me",
          function(response) {
            this.user = response;
            this.fireEvent("authenticate");
          }.bind(this)
        );
      } else {
        this.fireEvent("deauthenticate");
      }
    }
  },

  checkUnsaved: function() {
    return this.photoCollection.hasUnsaved()
      ? "Some photos have not been uploaded. " +
          "Are you sure you want to leave?"
      : null;
  },

  handleKey: function(event) {
    // Pass event to handlers, killing it if any return true
    var handlers = [this.photoViewer, this.photoDrawer];
    handlers.some(function(handler) {
      if (handler.handleKey(event.key)) {
        return true;
      }
    });
  },

  getUser: function() {
    return this.user;
  },

  upload: function() {
    this.fileUploader.upload(this.photoCollection);
  }
});

const ImageRenderer = require("./image-renderer");

var FileUploader = new Class({
  Implements: Events,

  initialize: function() {
    this.collection = null;
    this.queuedPhotos = [];
    this.createAlbum = false;
  },

  upload: function(collection) {
    this.collection = collection;
    this.queuedPhotos = collection.photos.filter(function(photo) {
      return photo.upload && !photo.id;
    });
    if (this.queuedPhotos.length) {
      if (this.createAlbum) {
        this.uploadAlbum(this.uploadQueuedPhoto.bind(this));
      } else {
        this.uploadQueuedPhoto();
      }
    }
  },

  uploadAlbum: function(callback) {
    FB.api(
      "/me/albums",
      "post",
      {
        name: this.collection.name,
        message: ""
      },
      function(response) {
        this.collection.id = response.id;
        callback();
      }.bind(this)
    );
  },

  uploadQueuedPhoto: function() {
    var photo = this.queuedPhotos.shift();
    if (photo) {
      photo.uploading();
      photo.loader.loadOriginal(
        function(file) {
          var renderer = new ImageRenderer(file);
          renderer.setMaximumDimensions(
            FileUploader.UPLOAD_WIDTH,
            FileUploader.UPLOAD_HEIGHT
          );
          renderer.setFilter(photo.filter);
          renderer.setCrop(photo.crop);
          renderer.renderToCanvas(
            function(canvas) {
              this.getBlob(
                photo,
                canvas,
                function(blob) {
                  this.sendPhoto(
                    photo,
                    blob,
                    function() {
                      this.uploadQueuedPhoto();
                    }.bind(this)
                  );
                }.bind(this)
              );
            }.bind(this)
          );
        }.bind(this)
      );
    }
  },

  getBlob: function(photo, canvas, callback) {
    if (canvas.toBlob) {
      canvas.toBlob(callback);
      return;
    }

    var builder =
      window.WebKitBlobBuilder || window.MozBlobBuilder || window.BlobBuilder;
    var blob = window.Blob;
    if (builder || blob) {
      // Extract the base64 encoded value, and convert it to a string.
      var uri = canvas.toDataURL();
      var match = uri.match(/^data:(.*?);base64,/);
      var mimetype = match[1];
      var encoded = uri.substr(match[0].length);
      var raw = atob(encoded);

      // If we add the bytes straight into our BlobBuilder then it will assume
      // text in UTF-8 encoding and corrupt the image.
      var buffer = new ArrayBuffer(raw.length);
      var bytes = new Uint8Array(buffer);
      for (var i = 0; i < raw.length; i++) {
        bytes[i] = raw.charCodeAt(i);
      }

      // Build a blob!
      if (blob) {
        callback(new blob([buffer], { type: mimetype }));
      } else if (builder) {
        var builder = new builder();
        builder.append(buffer);
        callback(builder.getBlob(mimetype));
      }
    }
  },

  sendPhoto: function(photo, blob, callback) {
    var albumId = this.collection.id || "me";
    var graphUri =
      "https://graph.facebook.com/" +
      albumId +
      "/photos?access_token=" +
      FB.getAccessToken();

    var form = new FormData();
    form.append("source", blob);
    form.append("message", photo.name);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", graphUri, true);
    xhr.onload = function(event) {
      var response = JSON.decode(xhr.responseText);
      response.id && photo.uploaded(response.id);
      callback();
    };
    xhr.send(form);
  }
});

FileUploader.UPLOAD_WIDTH = 1024;
FileUploader.UPLOAD_HEIGHT = 1024;

module.exports = FileUploader;

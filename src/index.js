/*require("./ui");
require("./image-loader");
require("./image-renderer");
require("./file-uploader");
require("./drag-handler");
require("./ui/base-screen");
require("./ui/login-screen");
require("./ui/photo-viewer");
require("./ui/photo-drawer");
require("./ui/photo-thumb");
require("./ui/base-editor");
require("./ui/crop-editor");
require("./ui/filter-editor");
require("./ui/preview-editor");
require("./data/photo-collection");
require("./data/photo-model");
require("./data/crop-model");*/

const Core = require("./core");
const instance = new Core();

module.exports.getInstance = function() {
  return instance;
};

window.App = module.exports;

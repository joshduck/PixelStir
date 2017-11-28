const Core = require("./core");
const instance = new Core();

module.exports.getInstance = function() {
  return instance;
};

window.App = module.exports;

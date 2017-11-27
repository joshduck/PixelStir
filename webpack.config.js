const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index",
  output: {
    filename: "static/bundle.js",
    path: __dirname + "/build"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: "./public",
        from: "**/*"
      }
    ])
  ]
};

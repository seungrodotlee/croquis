const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
  },
  output: {
    filename: "croquis.js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

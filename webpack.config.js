const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
  },
  output: {
    filename: "build.js",
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
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 3000
  }
};

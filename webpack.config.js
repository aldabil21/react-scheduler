const path = require("path");
const nodeExternals = require("webpack-node-externals");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "src", "lib", "Scheduler.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "Scheduler.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: [nodeExternals()],
};

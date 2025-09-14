const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProd
      ? "assets/js/[name].[contenthash].js"
      : "assets/js/bundle.js",
    assetModuleFilename: "assets/[name][ext]",
  },
  mode: isProd ? "production" : "development",
  devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      { test: /\.(png|jpe?g|gif|svg|ico)$/i, type: "asset/resource" },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
    }),
    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: "assets/css/[name].[contenthash].css",
          }),
        ]
      : []),
  ],
  devServer: {
    static: path.resolve(__dirname, "public"),
    port: 5173,
    open: true,
  },
};

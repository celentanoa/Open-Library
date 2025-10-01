const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProd = process.env.NODE_ENV === "production";
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
      // 🔹 Transpila solo i file JS con Babel
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components|\.s[ac]ss$)/, // 👈 così evita gli SCSS
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // 🔹 Gestisce SCSS
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      // 🔹 Gestisce immagini e icone
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".js", ".json"],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/favicon.ico",
          to: "favicon.ico",
        },
      ],
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

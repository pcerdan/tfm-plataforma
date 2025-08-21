const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: path.resolve(__dirname, "src/index.tsx"),
    mode: isProd ? "production" : "development",
    target: "web",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      port: 3000,
      historyApiFallback: true,
      static: { directory: path.resolve(__dirname, "public") },
      client: { overlay: true }
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "auto",
      clean: true
    },
    resolve: { extensions: [".tsx", ".ts", ".js"] },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin()
    ]
  };
};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: path.resolve(__dirname, "src/bootstrap.tsx"),
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      port: 3001,
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" }
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
        { test: /\.css$/, use: [require("mini-css-extract-plugin").loader, "css-loader", "postcss-loader"] }
      ]
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "registro",
        filename: "remoteEntry.js",
        exposes: {
          "./RegistroApp": "./src/App"
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          "react-dom": { singleton: true, requiredVersion: false }
        }
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin()
    ]
  };
};

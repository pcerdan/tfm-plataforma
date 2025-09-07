const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: path.resolve(__dirname, "src/index.tsx"),
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      port: 3001,
      static: [path.resolve(__dirname, "dist"), path.resolve(__dirname, "public")],
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      watchFiles: {
        paths: ["src/**/*"],
        options: { ignored: ["**/dist/**", "**/node_modules/**"] }
      }
    },
    output: { path: path.resolve(__dirname, "dist"), publicPath: "auto", clean: true },
    resolve: { extensions: [".tsx", ".ts", ".js"] },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }
      ]
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "registro",
        filename: "remoteEntry.js",
        exposes: {
          "./RegistroApp": "./src/App.tsx",
          "./styles": "./src/styles.css"
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          "react-dom": { singleton: true, requiredVersion: false }
        }
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin({ filename: "styles.css" }),
      new CopyWebpackPlugin({
        patterns: [{ from: "public/robots.txt", to: "." }],
      }),
    ],
  };
};

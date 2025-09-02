const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";
  const REMOTE_REGISTRO_URL =
    process.env.REMOTE_REGISTRO_URL || "http://localhost:3001/remoteEntry.js";

  return {
    entry: path.resolve(__dirname, "src/index.tsx"),
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: { 
      port: 3000, 
      historyApiFallback: true, 
      static: path.resolve(__dirname, "public"),
      watchFiles: {
        paths: ["src/**/*"],
        options: {
          ignored: ["**/dist/**", "**/node_modules/**"]
        }
      }
    },
    output: { path: path.resolve(__dirname, "dist"), publicPath: "auto", clean: true },
    resolve: { extensions: [".tsx", ".ts", ".js"] },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/, use: [ isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "postcss-loader"] }
      ]
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "app_shell",
        remotes: {
          registro: `registro@${REMOTE_REGISTRO_URL}`
        },
        exposes: {
          "./RegistroConfigContext": "./src/RegistroConfigContext"
        },
        shared: {
          react: { singleton: true, requiredVersion: false, eager: true },
          "react-dom": { singleton: true, requiredVersion: false, eager: true }
        }
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin()
    ],
  };
};

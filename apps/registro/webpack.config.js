const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const useMF = process.env.USE_MF === "1"; // ⬅️ Activa MF sólo si USE_MF=1

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: path.resolve(__dirname, "src/bootstrap.tsx"),
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      port: 3001,
      static: [
        path.resolve(__dirname, "dist"),
        path.resolve(__dirname, "public")
      ],
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      watchFiles: {
        paths: ["src/**/*"],
        options: {
          ignored: ["**/dist/**", "**/node_modules/**"]
        }
      }

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
        { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }
      ]
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "registro",
        filename: "remoteEntry.js",
        remotes: {
           appShell: "appShell@http://localhost:3000/remoteEntry.js"
        },
        exposes: {
          "./RegistroApp": "./src/App.tsx",
          "./styles": "./src/styles.css"
        },
        shared: {
            react: { singleton: true, requiredVersion: false, eager: true },
            "react-dom": { singleton: true, requiredVersion: false, eager: true }
          }
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
    ],
  };
};

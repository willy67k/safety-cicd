const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  devtool: false,
  watch: false,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: [/node_modules/],
        use: [
          {
            loader: "style-loader",
            options: {
              insert: "#mainContent",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js|.jsx$/,
        exclude: [/node_modules/],
        loader: "babel-loader",
        options: {
          presets: ["es2015", "react"],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

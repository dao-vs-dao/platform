const prod = process.env.NODE_ENV === "production";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: prod ? "production" : "development",
    entry: "./src/index.tsx",
    output: {
        path: __dirname + "/dist/",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: [".ts", ".tsx", ".js", ".json"]
                },
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(jpg|png|svg)$/i,
                loader: "url-loader",
                options: {
                    outputPath: "images"
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    devtool: prod ? undefined : "source-map",
    plugins: [
        new HtmlWebpackPlugin({ template: "index.html" }),
        new CopyWebpackPlugin({ patterns: [{ from: "public" }] }),
        new MiniCssExtractPlugin()
    ]
};

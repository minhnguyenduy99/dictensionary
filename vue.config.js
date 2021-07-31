const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/components/scss/main.scss";
        `,
      },
    },
  },
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.js",
      title: "Popup",
    },
    standalone: {
      template: "public/browser-extension.html",
      entry: "./src/standalone/main.js",
      title: "Standalone",
      filename: "index.html",
    },
    devtools: {
      template: "public/browser-extension.html",
      entry: "./src/devtools/main.js",
      title: "Devtools",
    },
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: "src/background.js",
        },
        contentScripts: {
          entries: {
            "content-script": ["src/content-scripts/content-script.js"],
          },
        },
      },
    },
  },
};

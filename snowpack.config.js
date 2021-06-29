/** @type {import("snowpack").SnowpackUserConfig } */
const path = require('path');

module.exports = {
  extends: "@snowpack/app-scripts-svelte",
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-sass',
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? {tsc: 'yarn pnpify tsc'} : {}),
      },
    ],
    [
      '@snowpack/plugin-webpack',
      {
        outputPattern: {
          js: "index.js",
          css: "index.css",
        },
        extendConfig: config => {
          delete config.optimization.splitChunks;
          delete config.optimization.runtimeChunk;
          config.module.rules[0] = {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
              },
              {
                loader: path.resolve(__dirname, './node_modules/@snowpack/plugin-webpack/plugins/import-meta-fix.js')
              },
              {
                loader: path.resolve(__dirname, './node_modules/@snowpack/plugin-webpack/plugins/proxy-import-resolve.js')
              }
            ]
          }
          return config;
        }
      }
    ]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    preload: false,
    bundle: false,
    splitting: false,
    treeshake: true,
    manifest: false,
    minify: false,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
    clean: true
  },
  alias: {
    Components: "./src/components",
    Helpers: "./src/helpers",
    Styles: "./src/styles",
    Types: "./src/types",
    Api: "./src/api"
  }
};

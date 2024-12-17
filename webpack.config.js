const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

let localCanisters, prodCanisters, canisters;

function initCanisterIds() {
  try {
    localCanisters = require(path.resolve('.dfx', 'local', 'canister_ids.json'));
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve('canister_ids.json'));
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

  canisters = network === 'local' ? localCanisters : prodCanisters;

  for (const canister in canisters) {
    process.env[canister.toUpperCase() + '_CANISTER_ID'] = canisters[canister][network];
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production';
initCanisterIds();

const frontendDirectory = 'dafi_frontend';
const frontendCanisterDirectory = 'dafi_frontend';

const asset_entry = path.join('src', 'index.html');

module.exports = {
  target: 'web',
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    index: path.join(__dirname, asset_entry).replace(/\.html$/, '.tsx'),
  },
  devtool: isDevelopment ? 'source-map' : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    fallback: {
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      stream: require.resolve('stream-browserify/'),
      util: require.resolve('util/'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist', frontendDirectory),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, asset_entry),
      cache: false,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DFX_NETWORK: 'local',
      ...Object.keys(process.env).filter((key) => key.includes('CANISTER')),
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: require.resolve('process/browser'),
    }),
    new Dotenv({
      path: `.env.${isDevelopment ? 'development' : 'production'}`,
      safe: true,
      systemvars: true,
      silent: true,
      defaults: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets'),
          to: path.join(__dirname, 'dist', frontendDirectory),
        },
      ],
    }),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
    hot: true,
    contentBase: path.resolve(__dirname, './src'),
    watchContentBase: true,
  },
};

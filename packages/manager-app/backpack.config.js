require('dotenv-extended').config();

const path = require('path');
const fs = require('fs');
const externals = require('webpack-node-externals');
const resolveWorkspaces = require('@melonproject/manager-interface/config/resolveWorkspaces');

module.exports = {
  webpack: (config, options, webpack) => {
    config.target = 'electron-main';
    config.output.path = path.resolve(__dirname, 'main', 'build');
    config.entry = {
      main: './main/src/index.ts',
      preload: './main/src/preload.ts',
    };

    config.resolve.extensions.push('.ts', '.node');
    config.resolve.alias = resolveWorkspaces([
      ['@melonproject/melon.js', 'lib'],
      ['@melonproject/graphql-schema', 'src'],
      ['@melonproject/exchange-aggregator', 'src'],
    ]);

    config.module.rules.map(rule => {
      if (rule.loader && rule.loader.match('babel-loader')) {
        // @TODO: Backpack uses their own version of babel-loader instead
        // of correctly resolving our version as a peer dependency. Hence, we
        // need to override this here so we can use Babel 7+.
        // @see https://github.com/jaredpalmer/backpack/issues/106
        rule.loader = 'babel-loader';
      }

      return rule;
    });

    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            cacheDirectory: true,
          },
        },
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'main', 'tsconfig.json'),
            transpileOnly: true,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    // Disable source maps and remove the source map loader (in the banner).
    // TODO: Figure out how we can make use of source maps in electron.
    config.devtool = false;
    config.plugins = config.plugins.filter(
      plugin => !(plugin instanceof webpack.BannerPlugin),
    );

    // Disable polyfilling of __dirname and __filename.
    config.node = Object.assign(config.node || {}, {
      __dirname: false,
      __filename: false,
    });

    config.externals = externals({
      modulesDir: path.resolve(__dirname, '..', '..', 'node_modules'),
      whitelist: [/^@melonproject\//],
    });

    return config;
  },
};

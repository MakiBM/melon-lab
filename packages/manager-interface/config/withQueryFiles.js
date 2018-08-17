const path = require('path');

module.exports = (nextConfig = {}) =>
  Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      // Inherit the previous configuration.
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: [/node_modules/, /\/schema\.(graphql|gql)$/],
        loader: 'graphql-tag/loader',
      });

      // Treat schema.gql files differently by directly loading their introspection
      // results instead of importing their AST.
      config.module.rules.unshift({
        test: /\/schema\.gql$/,
        exclude: /node_modules/,
        loader: require.resolve('@melonproject/graphql-schema/introspect.js'),
      });

      return config;
    },
  });

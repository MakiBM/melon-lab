const path = require('path');
const R = require('ramda');
const withTypeScript = require('@zeit/next-typescript')
const withQueryFiles = require('./config/withQueryFiles');
const withLinkedDependencies = require('./config/withLinkedDependencies');
const withResolveAliases = require('./config/withResolveAliases');
const withWebWorkers = require('./config/withWebWorkers');

const withComposedConfig = R.compose(
  withLinkedDependencies,
  withResolveAliases,
  withWebWorkers,
  withQueryFiles,
  withTypeScript,
);

module.exports = withComposedConfig({
  webWorkers: /\/graphql\/worker\.ts$/,
  linkedDependencies: [
    '@melonproject/graphql-schema',
    '@melonproject/manager-components'
  ],
  resolveAliases: {
    '@melonproject/graphql-schema': '@melonproject/graphql-schema/src',
    '@melonproject/manager-components': '@melonproject/manager-components/src',
  },
  distDir: '../dist',
  exportPathMap: () => ({
    '/': { page: '/' },
  }),
});

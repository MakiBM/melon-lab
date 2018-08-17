const path = require('path');
const resolveWorkspaces = require('./resolveWorkspaces');

const addIncludes = (includes) => {
  const addIncludesRecursive = (rule) => {
    if (rule.loader === 'hot-self-accept-loader') {
      return rule;
    }

    if (rule.use && rule.use.loader === 'hot-self-accept-loader') {
      return rule;
    }

    if (rule.use && Array.isArray(rule.use)) {
      for (const item of rule.use) {
        if (item.loader === 'hot-self-accept-loader') {
          return rule;
        }
      }
    }

    if (rule.include && rule.include.length) {
      // Add our custom include rules including linked node modules.
      // We only need to add them if the original definition specified
      // any include rules itself. Rules without any defined "includes"
      // apply globally anyways.
      rule.include = typeof rule.include === 'string' ? [rule.include] : rule.include;
      rule.include = rule.include.concat(includes);
    }

    if (rule.oneOf && rule.oneOf.length) {
      rule.oneOf = rule.oneOf.map(addIncludesRecursive);
    }

    return rule;
  };

  return addIncludesRecursive;
};

module.exports = (nextConfig = {}) => {
  const links = resolveWorkspaces(nextConfig.linkedDependencies || {});
  const includes = Object.values(links);
  if (!includes.length) {
    return nextConfig;
  }

  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      // Inherit the previous configuration.
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      config.resolve.alias = {
        ...links,
        ...(config.resolve.alias || {}),
      };

      config.module.rules.map(addIncludes(includes));

      return config;
    },
  });
};

module.exports = function (content, map, meta) {
  this.cacheable();

  const callback = this.async();

  const { graphql } = require('graphql');
  const { buildSchema, introspectionQuery } = require('graphql/utilities');
  graphql(buildSchema(content), introspectionQuery).then(result => {
    callback(null, `module.exports = ${JSON.stringify(result.data)}`, map, meta);
  });
};

const path = require("path");

const resolve = dir => path.resolve(__dirname, dir);

module.exports = function (config, env) {
  config.resolve.alias = Object.assign(config.resolve.alias, {
    "@components": resolve("src/components"),
    "@views": resolve("src/views"),
    "@theme": resolve("src/styles/rubic"),
    "@assets": resolve("src/assets"),
    '@store': resolve("src/store"),
    '@gql': resolve("src/apollo"),
    '@routes': resolve("src/routes"),
    '@helpers': resolve("src/helpers")
    // etc...
  });

  return config;
};
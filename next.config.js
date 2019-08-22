const webpack = require("webpack");

function webpackConfig(_config, options) {
	const config = _config;

  // No external CSS should get side-loaded by js
  // I'm looking at you vega-tooltip
  config.plugins.push(new webpack.IgnorePlugin(/\.(css|less)$/));

  if (options.isServer) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        XMLHttpRequest: ["xmlhttprequest", "XMLHttpRequest"],
        "root.XMLHttpRequest": ["xmlhttprequest", "XMLHttpRequest"],
        "global.XMLHttpRequest": ["xmlhttprequest", "XMLHttpRequest"],
        "window.XMLHttpRequest": ["xmlhttprequest", "XMLHttpRequest"]
      })
    );
  }

  config.node = { fs: 'empty' };

  return config;
}

module.exports = {
  webpack: webpackConfig
};

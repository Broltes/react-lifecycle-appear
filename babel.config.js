module.exports = function(api) {
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-runtime'
  ];

  const presetEnvOptions = {};
  if (api.env('node')) {
    // Node CJS
    presetEnvOptions.targets = {
      node: '6'
    };
  } else if (api.env('browser')) {
    // Browser ESM
    presetEnvOptions.modules = false;
    presetEnvOptions.targets = {
      browsers: ['Android >= 4.4', 'iOS >= 9']
    };
  }

  return {
    presets: [['@babel/preset-env', presetEnvOptions], '@babel/preset-react'],
    plugins
  };
};

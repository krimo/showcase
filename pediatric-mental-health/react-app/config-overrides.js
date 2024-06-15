const { addBabelPlugins, override } = require('customize-cra');

module.exports = override(...addBabelPlugins('@freshpaint/babel-plugin-annotate-react'));

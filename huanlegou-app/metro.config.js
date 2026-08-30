const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('html', 'css', 'js', 'jpg', 'jpeg', 'png', 'webp', 'svg');

module.exports = config;

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Find the project and workspace directories
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the project
config.watchFolders = [projectRoot];

// 2. Enable Expo Router support
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 3. Make sure .web.js extensions are properly resolved
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];

// 4. Add custom module resolution for react-native-google-mobile-ads
const mockPath = path.resolve(projectRoot, 'patches/react-native-google-mobile-ads.js');
config.resolver.extraNodeModules = {
  'react-native-web': path.resolve(projectRoot, 'node_modules/react-native-web'),
  'react-native-google-mobile-ads': fs.existsSync(mockPath) ? mockPath : undefined,
};

module.exports = config; 
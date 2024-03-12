const { getDefaultConfig } = require('expo/metro-config');

const { bootstrap } = require('./dfx.metro.config');
bootstrap("../../", "EXPO_PUBLIC");

const config = getDefaultConfig(__dirname);

module.exports = config;

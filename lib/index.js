const { existsSync } = require('fs');

let getPlatformInfo = () => [];
if (existsSync('../native/index.node')) {
  const addon = require('../native');
  getPlatformInfo = addon.get_platform_info;
}

module.exports = {
  getPlatformInfo,
};

const { existsSync } = require('fs');
const { join } = require('path');

let getPlatformInfo = () => [];
if (existsSync(join(__dirname, '../native/index.node'))) {
  const addon = require('../native');
  getPlatformInfo = addon.get_platform_info;
}

module.exports = {
  getPlatformInfo,
};

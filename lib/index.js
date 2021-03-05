const { existsSync } = require('fs');
const { join } = require('path');

let getPlatformInfo = () => [];
if (existsSync(join(__dirname, '../native/gpu-detection.node'))) {
  const addon = require('../native/gpu-detection.node');
  getPlatformInfo = addon.get_platform_info;
}

module.exports = {
  getPlatformInfo,
};

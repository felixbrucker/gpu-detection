const { existsSync } = require('fs');
const { join } = require('path');

let getPlatformInfo = () => [];
if (existsSync(join(__dirname, '../native/opencl-info.node'))) {
  const addon = require('../native/opencl-info.node');
  getPlatformInfo = addon.get_platform_info;
}

module.exports = {
  getPlatformInfo,
};

const { existsSync } = require('fs');
const { join } = require('path');

class OpenclUnavailableError extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'OpenclUnavailableError';
    this.message = message;
  }
}
const throwOpenclUnavailable = () => {
  throw new OpenclUnavailableError('The opencl native module is not available');
};

let getPlatformInfo = throwOpenclUnavailable;
if (existsSync(join(__dirname, '../native/opencl-info.node'))) {
  const addon = require('../native/opencl-info.node');
  getPlatformInfo = addon.get_platform_info;
}

module.exports = {
  getPlatformInfo,
  OpenclUnavailableError,
};

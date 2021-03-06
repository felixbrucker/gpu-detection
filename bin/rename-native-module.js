const { renameSync } = require('fs');
const { join } = require('path');

const nativeDir = join(__dirname, '..', 'native');

renameSync(join(nativeDir, 'index.node'), join(nativeDir, 'opencl-info.node'));

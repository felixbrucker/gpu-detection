const { join } = require('path');
const { createWriteStream, createReadStream } = require('fs');
const mkdirp = require('mkdirp');
const archiver = require('archiver');

(async () => {
  const buildDir = 'build';
  const nativeModulePath = join('native', 'gpu-detection.node');
  mkdirp.sync(buildDir);
  const zipFileStream = createWriteStream(join(buildDir, `${process.platform}-${process.arch}.tar.gz`));
  const zipFileClosedPromise = new Promise(resolve => zipFileStream.once('close', resolve));
  const archive = archiver('tar', { gzip: true, gzipOptions: { level: 1 } });
  archive.pipe(zipFileStream);
  archive.append(createReadStream(nativeModulePath), { name: nativeModulePath });
  await archive.finalize();
  await zipFileClosedPromise;
})();

const { join } = require('path');
const { createWriteStream, createReadStream } = require('fs');
const mkdirp = require('mkdirp');
const archiver = require('archiver');

(async () => {
  const buildDir = join(__dirname, '..', 'build');
  const nativeModulePathInZip = join('native', 'gpu-detection.node');
  const nativeModulePath = join(__dirname, '..', nativeModulePathInZip);
  mkdirp.sync(buildDir);
  const zipFileStream = createWriteStream(join(buildDir, `${process.platform}-${process.arch}.tar.gz`));
  const zipFileClosedPromise = new Promise(resolve => zipFileStream.once('close', resolve));
  const archive = archiver('tar', { gzip: true, gzipOptions: { level: 1 } });
  archive.pipe(zipFileStream);
  archive.append(createReadStream(nativeModulePath), { name: nativeModulePathInZip });
  await archive.finalize();
  await zipFileClosedPromise;
})();

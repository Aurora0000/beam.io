#!/usr/bin/env node
var EasyZip = require('easy-zip').EasyZip;
var zip = new EasyZip();
var packager = require('electron-packager');

var platform = null;
if (process.argv[2] === 'windows') {
  platform = 'win32';
} else if (process.argv[2] === 'darwin') {
  platform = 'darwin';
} else if (process.argv[2] === 'linux') {
  platform = 'linux';
}

var arch = process.argv[3] === 'x86' ? 'ia32' :
           process.argv[3] === 'x64' ? 'x64' : 'all';
packager({
  dir: '.',
  name: 'beamio',
  platform: [platform],
  arch: arch,
  version: '0.31.0',
  out: 'release',
}, function(err, appPath) {
  if (err) throw err;
  console.log('Zipping from ' + appPath);
  zip.folder(appPath);
  zip.writeToFile('release/beam-' + platform + '-' + arch + '.zip');
});

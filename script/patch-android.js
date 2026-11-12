/* Menyesuaikan project Android hasil "npx cap add android": izin kamera, memori besar, versi aplikasi. */
const fs = require('fs');
const path = require('path');

const android = path.join(__dirname, '..', 'android', 'app');
const manifestPath = path.join(android, 'src', 'main', 'AndroidManifest.xml');
const gradlePath = path.join(android, 'build.gradle');

let m = fs.readFileSync(manifestPath, 'utf8');
if (!m.includes('android.permission.CAMERA')) {
  m = m.replace('</manifest>',
    '    <uses-permission android:name="android.permission.CAMERA" />\n' +
    '    <uses-feature android:name="android.hardware.camera" android:required="false" />\n' +
    '</manifest>');
}
if (!m.includes('android:largeHeap')) {
  m = m.replace('<application', '<application\n        android:largeHeap="true"');
}
fs.writeFileSync(manifestPath, m);

let g = fs.readFileSync(gradlePath, 'utf8');
const run = parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10);
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + run);
g = g.replace(/versionName\s+"[^"]*"/, 'versionName "1.0.' + run + '"');
fs.writeFileSync(gradlePath, g);

console.log('Android dipatch: izin kamera, largeHeap, versionCode', run);

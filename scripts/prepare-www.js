/* Menyiapkan folder www/ dari src/Index.html: pustaka dibundel lokal (offline) dan jembatan native ditambahkan. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const nm = path.join(root, 'node_modules');

let html = fs.readFileSync(path.join(root, 'src', 'Index.html'), 'utf8');

function swap(from, to) {
  if (!html.includes(from)) throw new Error('Pola tidak ditemukan di Index.html: ' + from.slice(0, 70));
  html = html.replace(from, to);
}

swap('<base target="_top">', '');
swap('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'vendor/jspdf.umd.min.js');
swap('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/', 'vendor/pdfjs/');
swap('<script>\n', '<script src="native.js"></script>\n<script>\n');   // script utama (pertama yang tanpa src)
html = html.replace(/^.*fonts\.(googleapis|gstatic)\.com.*\n/gm, '');     // tanpa Google Fonts (offline)

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'vendor', 'pdfjs'), { recursive: true });
fs.writeFileSync(path.join(www, 'index.html'), html);
fs.copyFileSync(path.join(root, 'src', 'native.js'), path.join(www, 'native.js'));
fs.copyFileSync(path.join(nm, 'jspdf', 'dist', 'jspdf.umd.min.js'), path.join(www, 'vendor', 'jspdf.umd.min.js'));
fs.copyFileSync(path.join(nm, 'pdfjs-dist', 'build', 'pdf.min.js'), path.join(www, 'vendor', 'pdfjs', 'pdf.min.js'));
fs.copyFileSync(path.join(nm, 'pdfjs-dist', 'build', 'pdf.worker.min.js'), path.join(www, 'vendor', 'pdfjs', 'pdf.worker.min.js'));
console.log('www/ siap:', fs.readdirSync(www).join(', '));

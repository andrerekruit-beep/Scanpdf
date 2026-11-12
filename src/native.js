/* Jembatan aplikasi Android: menyimpan PDF ke cache lalu membuka menu Bagikan / Simpan. */
(function () {
  var cap = window.Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;   // dijalankan di browser biasa: tidak aktif

  window.nativeSavePdf = async function (base64, fileName) {
    var P = cap.Plugins || {};
    if (!P.Filesystem || !P.Share) throw new Error('Plugin Android belum siap');
    var saved = await P.Filesystem.writeFile({ path: fileName, data: base64, directory: 'CACHE' });
    await P.Share.share({ title: fileName, url: saved.uri, dialogTitle: 'Simpan atau bagikan PDF' });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var pdf = document.getElementById('btnPdf');
    var drive = document.getElementById('btnDrive');
    var msg = document.getElementById('driveMsg');
    if (pdf) pdf.textContent = 'Simpan / bagikan PDF';
    if (drive) drive.style.display = 'none';               // Google Drive via Apps Script tidak ada di aplikasi
    if (msg) msg.textContent = 'Tambahkan foto atau PDF, atur halaman, lalu ketuk "Simpan / bagikan PDF" dan pilih Files, Drive, WhatsApp, atau aplikasi lain.';
  });
})();

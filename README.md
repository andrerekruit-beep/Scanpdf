# ScanPDF Studio untuk Android

Aplikasi Android (Capacitor) dari web app ScanPDF Studio: foto/PDF menjadi PDF hasil scan, dengan pilih area
4 sudut + deteksi otomatis tepi kertas, filter scan (warna, abu-abu, hitam putih), watermark, dan edit halaman.
Semua pemrosesan berjalan di perangkat dan bisa dipakai offline.

## Membuat APK lewat GitHub Actions

1. Buat repository baru di GitHub, lalu unggah seluruh isi folder ini (termasuk `.github/` dan `package-lock.json`).
2. Push ke branch `main`. Workflow **Build Android APK** berjalan otomatis (sekitar 5-10 menit).
   Bisa juga dijalankan manual: tab **Actions** > **Build Android APK** > **Run workflow**.
3. Setelah hijau, buka run tersebut dan unduh artifact **ScanPDF-Studio-apk** (berisi `ScanPDF-Studio-debug.apk`).
4. Salin APK ke HP, buka, lalu izinkan "Install dari sumber tidak dikenal" jika diminta.

APK debug sudah ditandatangani dengan kunci debug sehingga langsung bisa dipasang.

### Rilis otomatis
Push tag berawalan `v` (misalnya `git tag v1.0.0 && git push --tags`), maka APK juga dilampirkan ke halaman **Releases**.

### APK rilis dengan tanda tangan sendiri (opsional)
Untuk pembaruan yang konsisten atau Play Store, buat keystore sekali saja:

```bash
keytool -genkeypair -v -keystore release.jks -alias scanpdf -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.jks     # di macOS: base64 -i release.jks
```

Lalu isi di **Settings > Secrets and variables > Actions**:

| Secret | Isi |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | keluaran perintah base64 di atas |
| `ANDROID_KEYSTORE_PASSWORD` | password keystore |
| `ANDROID_KEY_ALIAS` | `scanpdf` (alias yang dipakai) |
| `ANDROID_KEY_PASSWORD` | password key (kosongkan jika sama dengan keystore) |

Jika secret terisi, workflow juga menghasilkan `ScanPDF-Studio-release.apk`. Simpan file `release.jks` dengan aman:
jika hilang, aplikasi tidak bisa diperbarui di atas versi yang sudah terpasang. Jangan commit file ini.

## Build di komputer sendiri

Butuh Node 20+, JDK 21, dan Android Studio.

```bash
npm install
npm run prepare:www
npm run android:add      # sekali saja, membuat folder android/
npm run android:sync
npm run android:open     # buka di Android Studio, lalu Run / Build APK
```

## Struktur

- `src/Index.html` - antarmuka dan seluruh logika (sama dengan versi Apps Script)
- `src/native.js` - jembatan Android: simpan PDF ke cache lalu buka menu Bagikan/Simpan
- `scripts/prepare-www.js` - membuat `www/` (jsPDF dan pdf.js dibundel lokal, tanpa CDN)
- `scripts/patch-android.js` - izin kamera, `largeHeap`, nomor versi dari nomor run
- `capacitor.config.json` - nama dan ID aplikasi (`id.scanpdf.studio`); ubah `appId` bila perlu

## Catatan

- Tombol **Simpan ke Drive** disembunyikan di aplikasi; gantinya **Simpan / bagikan PDF** (menu Bagikan Android
  berisi Files, Drive, WhatsApp, dan lainnya).
- Ikon masih bawaan Capacitor. Untuk ikon sendiri, ganti file di `android/app/src/main/res/mipmap-*` atau pakai
  `@capacitor/assets` setelah `android:add`.

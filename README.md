# Sistem Absensi Guru

Sistem absensi digital untuk guru dengan fitur lengkap untuk mengelola kehadiran siswa.

## Struktur File

sistem-absensi-guru/
│
├── index.html
├── styles/
│   └── style.css
├── scripts/
│   ├── app.js
│   ├── auth.js
│   ├── kelas.js
│   ├── mapel.js
│   ├── absensi.js
│   ├── laporan.js
│   └── pdf-export.js
└── README.md

## Fitur Utama

1. **Autentikasi Guru**
   - Login dengan username dan password
   - Data demo: username `guru`, password `guru123`

2. **Manajemen Kelas**
   - Tambah dan hapus kelas
   - Kelas jurusan Teknik Informatika
   - Kelola jumlah siswa per kelas

3. **Manajemen Mata Pelajaran**
   - 13 mata pelajaran lengkap
   - Profil guru per mata pelajaran
   - Edit nama guru dan inisial avatar

4. **Absensi Siswa**
   - Input status kehadiran (Hadir, Izin, Sakit, Alpha)
   - Keterangan untuk izin dan sakit
   - Waktu otomatis untuk siswa hadir

5. **Laporan & Ekspor**
   - Riwayat absensi per mata pelajaran
   - Ekspor PDF per sesi atau semua riwayat
   - Hapus riwayat absensi

## Cara Penggunaan

1. Buka `index.html` di browser
2. Login dengan username `guru` dan password `guru123`
3. Pilih atau tambah kelas
4. Pilih mata pelajaran
5. Input absensi siswa di halaman Absensi
6. Lihat laporan dan ekspor PDF di halaman Laporan

## Teknologi

- HTML5, CSS3, JavaScript ES6+
- Local Storage untuk penyimpanan data
- jsPDF untuk ekspor PDF
- Font Awesome untuk ikon
- Responsive design

## Catatan

- Data disimpan di local storage browser
- Tidak memerlukan server atau database
- Kompatibel dengan browser modern

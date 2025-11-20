// Variabel global
let currentKelasId = null;
let currentEditingMapel = null;
let currentEditingSiswa = null;

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initAppData();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Event listener untuk login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = sampleData.users.find(u => u.username === username && u.password === password);

        if (user) {
            showKelasPage();
        } else {
            alert('Username atau password salah!');
        }
    });

    // Event listener untuk logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            showLoginPage();
        }
    });

    // Event listener untuk navigasi
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });

    // Event listener untuk simpan kelas
    document.getElementById('simpan-kelas').addEventListener('click', simpanKelas);

    // Event listener untuk simpan siswa
    document.getElementById('simpan-siswa').addEventListener('click', simpanSiswa);

    // Event listener untuk counter siswa
    document.getElementById('increase-students').addEventListener('click', function() {
        const currentCount = parseInt(document.getElementById('student-count').textContent);
        document.getElementById('student-count').textContent = currentCount + 1;
    });

    document.getElementById('decrease-students').addEventListener('click', function() {
        const currentCount = parseInt(document.getElementById('student-count').textContent);
        if (currentCount > 1) {
            document.getElementById('student-count').textContent = currentCount - 1;
        }
    });

    // Event listener untuk simpan absensi
    document.getElementById('simpan-semua-btn').addEventListener('click', simpanSemuaAbsensi);

    // Event listener untuk ekspor PDF di halaman absensi
    document.getElementById('export-pdf-btn').addEventListener('click', function() {
        exportPDF();
    });

    // Event listener untuk ekspor semua PDF di halaman laporan
    document.getElementById('export-all-pdf-btn').addEventListener('click', exportAllPDF);

    // Event listener untuk simpan profil mapel
    document.getElementById('simpan-profil-mapel').addEventListener('click', simpanProfilMapel);

    // Event listener untuk simpan keterangan
    document.getElementById('simpan-keterangan').addEventListener('click', simpanKeterangan);

    showLoginPage();
});

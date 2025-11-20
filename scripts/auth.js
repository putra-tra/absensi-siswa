// Data contoh untuk demo
const sampleData = {
    users: [
        {
            username: "guru",
            password: "guru123",
            name: "Bu Sari, S.Pd",
            avatar: "S"
        }
    ],
    // Daftar mapel lengkap
    mapelList: [
        "PIPAS",
        "Bahasa Indonesia",
        "Agama",
        "Mapel Produktif",
        "Informatika",
        "BK",
        "Sejarah",
        "Matematika",
        "PPKN",
        "Seni",
        "Olahraga",
        "Bahasa Daerah",
        "Bahasa Inggris"
    ]
};

// Inisialisasi data aplikasi
function initAppData() {
    // Inisialisasi data guru jika belum ada
    if (!localStorage.getItem('guruData')) {
        localStorage.setItem('guruData', JSON.stringify({
            name: "Bu Sari, S.Pd",
            avatar: "S"
        }));
    }

    // Inisialisasi data kelas jika belum ada
    if (!localStorage.getItem('kelasData')) {
        localStorage.setItem('kelasData', JSON.stringify([]));
    }

    // Inisialisasi data siswa jika belum ada
    if (!localStorage.getItem('siswaData')) {
        localStorage.setItem('siswaData', JSON.stringify([]));
    }

    // Inisialisasi data absensi jika belum ada
    if (!localStorage.getItem('absensiData')) {
        localStorage.setItem('absensiData', JSON.stringify({}));
    }

    // Inisialisasi data riwayat jika belum ada
    if (!localStorage.getItem('riwayatAbsensi')) {
        localStorage.setItem('riwayatAbsensi', JSON.stringify({}));
    }

    // Inisialisasi pilihan user
    if (!localStorage.getItem('selectedKelas')) {
        localStorage.setItem('selectedKelas', JSON.stringify(null));
    }

    if (!localStorage.getItem('selectedMapel')) {
        localStorage.setItem('selectedMapel', JSON.stringify(null));
    }

    // Inisialisasi data mapel guru
    initMapelGuruData();
}

// Fungsi untuk mendapatkan data
function getKelasData() {
    return JSON.parse(localStorage.getItem('kelasData') || '[]');
}

function saveKelasData(data) {
    localStorage.setItem('kelasData', JSON.stringify(data));
}

function getSiswaData() {
    return JSON.parse(localStorage.getItem('siswaData') || '[]');
}

function saveSiswaData(data) {
    localStorage.setItem('siswaData', JSON.stringify(data));
}

function getAbsensiData() {
    return JSON.parse(localStorage.getItem('absensiData') || '{}');
}

function saveAbsensiData(data) {
    localStorage.setItem('absensiData', JSON.stringify(data));
}

// Fungsi untuk mendapatkan riwayat absensi per kelas
function getRiwayatAbsensi() {
    const selectedKelas = getSelectedKelas();
    if (!selectedKelas) return [];

    const allRiwayat = JSON.parse(localStorage.getItem('riwayatAbsensi') || '{}');
    return allRiwayat[selectedKelas.id] || [];
}

// Fungsi untuk menyimpan riwayat absensi per kelas
function saveRiwayatAbsensi(data) {
    const selectedKelas = getSelectedKelas();
    if (!selectedKelas) return;

    const allRiwayat = JSON.parse(localStorage.getItem('riwayatAbsensi') || '{}');
    allRiwayat[selectedKelas.id] = data;
    localStorage.setItem('riwayatAbsensi', JSON.stringify(allRiwayat));
}

function getSelectedKelas() {
    return JSON.parse(localStorage.getItem('selectedKelas') || 'null');
}

function saveSelectedKelas(data) {
    localStorage.setItem('selectedKelas', JSON.stringify(data));
}

function getSelectedMapel() {
    return JSON.parse(localStorage.getItem('selectedMapel') || 'null');
}

function saveSelectedMapel(data) {
    localStorage.setItem('selectedMapel', JSON.stringify(data));
}

function getGuruData() {
    return JSON.parse(localStorage.getItem('guruData') || '{}');
}

// Fungsi untuk menyimpan data guru
function saveGuruData(data) {
    localStorage.setItem('guruData', JSON.stringify(data));
}

// Fungsi untuk menampilkan halaman
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('kelas-page').style.display = 'none';
    document.getElementById('mapel-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'none';
}

function showKelasPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('kelas-page').style.display = 'flex';
    document.getElementById('mapel-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'none';
    renderKelasList();
}

function showMapelPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('kelas-page').style.display = 'none';
    document.getElementById('mapel-page').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
    renderMapelList();
}

function showAppPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('kelas-page').style.display = 'none';
    document.getElementById('mapel-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    updateDashboard();
}

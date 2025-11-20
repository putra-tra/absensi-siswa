// Fungsi untuk render daftar kelas
function renderKelasList() {
    const kelasListElement = document.getElementById('kelas-list');
    kelasListElement.innerHTML = '';

    const kelasData = getKelasData();

    // Tampilkan kelas yang tersedia
    kelasData.forEach(kelas => {
        const kelasItem = document.createElement('div');
        kelasItem.className = 'kelas-item';
        kelasItem.setAttribute('data-kelas-id', kelas.id);
        kelasItem.innerHTML = `
        <div class="kelas-actions">
        <button class="action-icon add-siswa" data-kelas-id="${kelas.id}" title="Tambah Siswa">
        <i class="fas fa-user-plus"></i>
        </button>
        <button class="action-icon delete-kelas" data-kelas-id="${kelas.id}" title="Hapus Kelas">
        <i class="fas fa-trash"></i>
        </button>
        </div>
        <div class="kelas-icon">
        <i class="fas fa-chalkboard"></i>
        </div>
        <h3 class="kelas-name">${kelas.name}</h3>
        <p class="kelas-info">Teknik Informatika</p>
        <p class="kelas-info">${kelas.jumlahSiswa} Siswa</p>
        <div class="text-center mt-3">
        <span class="status-badge status-alpha">Klik untuk memilih</span>
        </div>
        `;

        kelasListElement.appendChild(kelasItem);
    });

    // Tambahkan card untuk menambah kelas baru
    const addKelasCard = document.createElement('div');
    addKelasCard.className = 'add-card';
    addKelasCard.innerHTML = `
    <div class="add-icon">
    <i class="fas fa-plus-circle"></i>
    </div>
    <div class="add-text">Tambah Kelas Baru</div>
    `;
    addKelasCard.addEventListener('click', bukaModalTambahKelas);
    kelasListElement.appendChild(addKelasCard);

    // Event listener untuk memilih kelas
    document.querySelectorAll('.kelas-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.kelas-actions')) {
                const kelasId = parseInt(this.getAttribute('data-kelas-id'));
                pilihKelas(kelasId);
            }
        });
    });

    // Event listener untuk tombol tambah siswa
    document.querySelectorAll('.add-siswa').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const kelasId = parseInt(this.getAttribute('data-kelas-id'));
            bukaModalTambahSiswa(kelasId);
        });
    });

    // Event listener untuk tombol hapus kelas
    document.querySelectorAll('.delete-kelas').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const kelasId = parseInt(this.getAttribute('data-kelas-id'));
            hapusKelas(kelasId);
        });
    });
}

// Fungsi untuk memilih kelas
function pilihKelas(kelasId) {
    const kelasData = getKelasData();
    const kelas = kelasData.find(k => k.id === kelasId);

    if (kelas) {
        saveSelectedKelas(kelas);
        showMapelPage();
    }
}

// Fungsi untuk modal tambah kelas
function bukaModalTambahKelas() {
    document.getElementById('nama-kelas').value = '';
    document.getElementById('student-count').textContent = '30';
    document.getElementById('kelas-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('kelas-modal').style.display = 'none';
}

// Fungsi untuk menyimpan kelas
function simpanKelas() {
    const namaKelas = document.getElementById('nama-kelas').value;
    const jumlahSiswa = parseInt(document.getElementById('student-count').textContent);

    if (!namaKelas) {
        alert('Harap isi nama kelas!');
        return;
    }

    const kelasData = getKelasData();
    const newId = kelasData.length > 0 ? Math.max(...kelasData.map(k => k.id)) + 1 : 1;

    kelasData.push({
        id: newId,
        name: namaKelas,
        jurusan: "Teknik Informatika",
        jumlahSiswa: jumlahSiswa
    });

    saveKelasData(kelasData);
    closeModal();
    renderKelasList();
    alert('Kelas berhasil ditambahkan!');
}

// Fungsi untuk menghapus kelas
function hapusKelas(kelasId) {
    const kelasData = getKelasData();
    const kelas = kelasData.find(k => k.id === kelasId);

    if (kelas && confirm(`Apakah Anda yakin ingin menghapus kelas ${kelas.name}?`)) {
        // Hapus kelas
        const updatedKelasData = kelasData.filter(k => k.id !== kelasId);
        saveKelasData(updatedKelasData);

        // Hapus siswa di kelas tersebut
        const siswaData = getSiswaData();
        const updatedSiswaData = siswaData.filter(s => s.kelasId !== kelasId);
        saveSiswaData(updatedSiswaData);

        // Hapus riwayat absensi untuk kelas ini
        const allRiwayat = JSON.parse(localStorage.getItem('riwayatAbsensi') || '{}');
        delete allRiwayat[kelasId];
        localStorage.setItem('riwayatAbsensi', JSON.stringify(allRiwayat));

        // Hapus data absensi untuk kelas ini
        const absensiData = getAbsensiData();
        Object.keys(absensiData).forEach(key => {
            if (key.startsWith(`${kelasId}-`)) {
                delete absensiData[key];
            }
        });
        saveAbsensiData(absensiData);

        // Jika kelas yang dihapus sedang dipilih, reset pilihan
        const selectedKelas = getSelectedKelas();
        if (selectedKelas && selectedKelas.id === kelasId) {
            saveSelectedKelas(null);
            saveSelectedMapel(null);
        }

        renderKelasList();
        alert(`Kelas ${kelas.name} berhasil dihapus!`);
    }
}

// Fungsi untuk modal tambah siswa
function bukaModalTambahSiswa(kelasId) {
    currentKelasId = kelasId;
    document.getElementById('nis-siswa').value = '';
    document.getElementById('nama-siswa').value = '';
    document.getElementById('siswa-modal').style.display = 'flex';
}

function closeSiswaModal() {
    document.getElementById('siswa-modal').style.display = 'none';
}

// Fungsi untuk menyimpan siswa
function simpanSiswa() {
    const nis = document.getElementById('nis-siswa').value;
    const nama = document.getElementById('nama-siswa').value;

    if (!nis || !nama) {
        alert('Harap isi semua field!');
        return;
    }

    const siswaData = getSiswaData();
    const newId = siswaData.length > 0 ? Math.max(...siswaData.map(s => s.id)) + 1 : 1;

    siswaData.push({
        id: newId,
        nis: nis,
        name: nama,
        kelasId: currentKelasId
    });

    saveSiswaData(siswaData);
    closeSiswaModal();
    alert('Siswa berhasil ditambahkan!');

    // Update jumlah siswa di kelas
    const kelasData = getKelasData();
    const kelasIndex = kelasData.findIndex(k => k.id === currentKelasId);
    if (kelasIndex !== -1) {
        const siswaDiKelas = siswaData.filter(s => s.kelasId === currentKelasId);
        kelasData[kelasIndex].jumlahSiswa = siswaDiKelas.length;
        saveKelasData(kelasData);
        renderKelasList();
    }
}

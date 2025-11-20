// Data untuk menyimpan profil guru per mapel
const initMapelGuruData = () => {
    if (!localStorage.getItem('mapelGuruData')) {
        const defaultGuruData = {
            'PIPAS': { nama: 'Guru PIPAS', inisial: 'GP' },
            'Bahasa Indonesia': { nama: 'Guru Bahasa Indonesia', inisial: 'BI' },
            'Agama': { nama: 'Guru Agama', inisial: 'GA' },
            'Mapel Produktif': { nama: 'Guru Produktif', inisial: 'GP' },
            'Informatika': { nama: 'Guru Informatika', inisial: 'GI' },
            'BK': { nama: 'Guru BK', inisial: 'GB' },
            'Sejarah': { nama: 'Guru Sejarah', inisial: 'GS' },
            'Matematika': { nama: 'Guru Matematika', inisial: 'GM' },
            'PPKN': { nama: 'Guru PPKN', inisial: 'GP' },
            'Seni': { nama: 'Guru Seni', inisial: 'GS' },
            'Olahraga': { nama: 'Guru Olahraga', inisial: 'GO' },
            'Bahasa Daerah': { nama: 'Guru Bahasa Daerah', inisial: 'BD' },
            'Bahasa Inggris': { nama: 'Guru Bahasa Inggris', inisial: 'GI' }
        };
        localStorage.setItem('mapelGuruData', JSON.stringify(defaultGuruData));
    }
};

// Fungsi untuk mendapatkan data guru per mapel
const getMapelGuruData = () => {
    return JSON.parse(localStorage.getItem('mapelGuruData') || '{}');
};

// Fungsi untuk menyimpan data guru per mapel
const saveMapelGuruData = (data) => {
    localStorage.setItem('mapelGuruData', JSON.stringify(data));
};

// Fungsi untuk mendapatkan profil guru untuk mapel tertentu
const getGuruForMapel = (mapelName) => {
    const mapelGuruData = getMapelGuruData();
    return mapelGuruData[mapelName] || { nama: 'Guru Mapel', inisial: 'GM' };
};

// Fungsi untuk membuka modal edit profil mapel
const bukaModalEditMapel = (mapelName) => {
    const guruData = getGuruForMapel(mapelName);

    document.getElementById('edit-nama-mapel').value = mapelName;
    document.getElementById('edit-nama-guru').value = guruData.nama;
    document.getElementById('edit-inisial-guru').value = guruData.inisial;

    // Simpan mapel yang sedang diedit
    currentEditingMapel = mapelName;

    document.getElementById('mapel-edit-modal').style.display = 'flex';
};

// Fungsi untuk menutup modal edit mapel
const closeMapelEditModal = () => {
    document.getElementById('mapel-edit-modal').style.display = 'none';
    currentEditingMapel = null;
};

// Fungsi untuk menyimpan profil mapel
const simpanProfilMapel = () => {
    const mapelName = document.getElementById('edit-nama-mapel').value;
    const namaGuru = document.getElementById('edit-nama-guru').value;
    const inisialGuru = document.getElementById('edit-inisial-guru').value;

    if (!namaGuru || !inisialGuru) {
        alert('Harap isi semua field!');
        return;
    }

    const mapelGuruData = getMapelGuruData();
    mapelGuruData[mapelName] = {
        nama: namaGuru,
        inisial: inisialGuru
    };

    saveMapelGuruData(mapelGuruData);
    closeMapelEditModal();

    // Render ulang daftar mapel untuk update tampilan
    renderMapelList();

    alert('Profil mapel berhasil disimpan!');
};

// Fungsi untuk render daftar mapel (dengan fitur edit profil)
function renderMapelList() {
    const mapelListElement = document.getElementById('mapel-list');
    mapelListElement.innerHTML = '';

    const selectedKelas = getSelectedKelas();

    // Tampilkan semua mapel yang tersedia
    sampleData.mapelList.forEach((mapelName, index) => {
        const guruData = getGuruForMapel(mapelName);

        const mapelItem = document.createElement('div');
        mapelItem.className = 'mapel-item';
        mapelItem.style.borderTopColor = getMapelColor(mapelName);
        mapelItem.setAttribute('data-mapel-name', mapelName);
        mapelItem.innerHTML = `
        <div class="mapel-actions">
        <button class="edit-mapel-btn" onclick="bukaModalEditMapel('${mapelName}')" title="Edit Profil Mapel">
        <i class="fas fa-edit"></i>
        </button>
        </div>
        <div class="mapel-icon">
        <i class="${getMapelIcon(mapelName)}"></i>
        </div>
        <h3 class="mapel-name">${mapelName}</h3>
        <p class="mapel-info">Kelas: ${selectedKelas.name}</p>
        <div class="mapel-guru-info">
        <i class="fas fa-chalkboard-teacher"></i> ${guruData.nama}
        </div>
        <div class="text-center mt-3">
        <span class="status-badge status-alpha">Klik untuk memilih</span>
        </div>
        `;

        mapelListElement.appendChild(mapelItem);
    });

    // Event listener untuk memilih mapel
    document.querySelectorAll('.mapel-item').forEach(item => {
        item.addEventListener('click', function() {
            const mapelName = this.getAttribute('data-mapel-name');
            pilihMapel(mapelName);
        });
    });
}

// Fungsi untuk memilih mapel (dengan update profil guru)
function pilihMapel(mapelName) {
    saveSelectedMapel(mapelName);

    // Update profil guru berdasarkan mapel yang dipilih
    const guruData = getGuruForMapel(mapelName);
    saveGuruData({
        name: guruData.nama,
        avatar: guruData.inisial
    });

    showAppPage();
}

// Fungsi untuk mendapatkan ikon dan warna mapel
function getMapelIcon(mapelName) {
    const iconMap = {
        'PIPAS': 'fas fa-microscope',
        'Bahasa Indonesia': 'fas fa-book',
        'Agama': 'fas fa-pray',
        'Mapel Produktif': 'fas fa-tools',
        'Informatika': 'fas fa-laptop-code',
        'BK': 'fas fa-comments',
        'Sejarah': 'fas fa-monument',
        'Matematika': 'fas fa-calculator',
        'PPKN': 'fas fa-landmark',
        'Seni': 'fas fa-palette',
        'Olahraga': 'fas fa-running',
        'Bahasa Daerah': 'fas fa-language',
        'Bahasa Inggris': 'fas fa-globe'
    };
    return iconMap[mapelName] || 'fas fa-book';
}

function getMapelColor(mapelName) {
    const colorMap = {
        'PIPAS': '#d4a762',
        'Bahasa Indonesia': '#e74c3c',
        'Agama': '#a8c686',
        'Mapel Produktif': '#f39c12',
        'Informatika': '#9b59b6',
        'BK': '#8bbabb',
        'Sejarah': '#d35400',
        'Matematika': '#5a4c3e',
        'PPKN': '#8e44ad',
        'Seni': '#e67e22',
        'Olahraga': '#a8c686',
        'Bahasa Daerah': '#16a085',
        'Bahasa Inggris': '#d4a762'
    };
    return colorMap[mapelName] || '#d4a762';
}

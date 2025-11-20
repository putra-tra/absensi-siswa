// Fungsi untuk dashboard
function updateDashboard() {
    const selectedKelas = getSelectedKelas();
    const selectedMapel = getSelectedMapel();
    const guruData = getGuruData();

    // Update header
    document.getElementById('user-name').textContent = guruData.name;
    document.getElementById('user-avatar').textContent = guruData.avatar;
    document.getElementById('kelas-info-header').textContent = `Kelas: ${selectedKelas.name}`;
    document.getElementById('mapel-info-header').textContent = `Mapel: ${selectedMapel}`;

    // Update dashboard info
    document.getElementById('info-kelas-mapel').textContent = `Kelas: ${selectedKelas.name} | Mapel: ${selectedMapel}`;

    const siswaData = getSiswaData();
    const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);
    document.getElementById('info-jumlah-siswa').textContent = `Jumlah Siswa: ${siswaDiKelas.length}`;
    document.getElementById('total-siswa').textContent = siswaDiKelas.length;

    // Update waktu
    updateDateTime();
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    const timeString = now.toLocaleTimeString('id-ID');

    document.getElementById('current-date-time').textContent = `${dateString} - ${timeString}`;
    document.getElementById('absensi-date').textContent = now.toLocaleDateString('id-ID');
    document.getElementById('absensi-time').textContent = timeString;
}

// Fungsi untuk navigasi halaman
function showPage(pageName) {
    document.querySelectorAll('.content > div').forEach(page => {
        page.classList.add('d-none');
    });

    document.getElementById(`${pageName}-page`).classList.remove('d-none');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'absensi') {
        renderAbsensiPage();
    } else if (pageName === 'laporan') {
        renderLaporanPage();
    }
}

// Fungsi untuk render halaman absensi
function renderAbsensiPage() {
    const selectedKelas = getSelectedKelas();
    const selectedMapel = getSelectedMapel();
    const siswaData = getSiswaData();
    const absensiData = getAbsensiData();

    document.getElementById('absensi-mapel-name').textContent = `Absensi - ${selectedMapel}`;

    const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);
    document.getElementById('absensi-total-siswa').textContent = siswaDiKelas.length;

    const today = new Date().toISOString().split('T')[0];
    const key = `${selectedKelas.id}-${selectedMapel}-${today}`;
    const todayAbsensi = absensiData[key] || { siswa: [] };

    let hadirCount = 0;
    const siswaListElement = document.getElementById('siswa-list');
    siswaListElement.innerHTML = '';

    siswaDiKelas.forEach((siswa, index) => {
        const absensiSiswa = todayAbsensi.siswa.find(s => s.siswaId === siswa.id) || {
            status: 'alpha',
            waktu: null,
            keterangan: ''
        };

        if (absensiSiswa.status === 'hadir') hadirCount++;

        const statusText = getStatusText(absensiSiswa.status);
        const statusClass = getStatusClass(absensiSiswa.status);
        const waktuText = absensiSiswa.waktu ?
        new Date(absensiSiswa.waktu).toLocaleTimeString('id-ID') : '-';

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${siswa.nis}</td>
        <td>${siswa.name}</td>
        <td>
        <span class="status-badge ${statusClass}" data-siswa-id="${siswa.id}" data-status="${absensiSiswa.status}">
        ${statusText}
        </span>
        </td>
        <td>${waktuText}</td>
        <td>
        ${absensiSiswa.keterangan || '-'}
        ${absensiSiswa.status !== 'hadir' && absensiSiswa.status !== 'alpha' ?
            `<button class="btn btn-small btn-info mt-1" onclick="bukaModalKeterangan(${siswa.id}, '${siswa.name}', '${absensiSiswa.status}')">
            <i class="fas fa-edit"></i> Edit Keterangan
            </button>` : ''
        }
        </td>
        `;

        siswaListElement.appendChild(row);
    });

    document.getElementById('absensi-hadir').textContent = hadirCount;

    // Event listener untuk status badge
    document.querySelectorAll('.status-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const siswaId = parseInt(this.getAttribute('data-siswa-id'));
            const currentStatus = this.getAttribute('data-status');
            const nextStatus = getNextStatus(currentStatus);

            this.setAttribute('data-status', nextStatus);
            this.textContent = getStatusText(nextStatus);
            this.className = `status-badge ${getStatusClass(nextStatus)}`;

            // Update waktu jika status menjadi hadir
            const row = this.closest('tr');
            const waktuCell = row.querySelector('td:nth-child(5)');
            const keteranganCell = row.querySelector('td:nth-child(6)');

            if (nextStatus === 'hadir') {
                waktuCell.textContent = new Date().toLocaleTimeString('id-ID');
                // Hapus tombol edit keterangan jika status menjadi hadir
                keteranganCell.innerHTML = '-';
            } else {
                waktuCell.textContent = '-';
                // Tambah tombol edit keterangan untuk status izin/sakit
                if (nextStatus !== 'alpha') {
                    const siswaName = row.querySelector('td:nth-child(3)').textContent;
                    keteranganCell.innerHTML = `-
                    <button class="btn btn-small btn-info mt-1" onclick="bukaModalKeterangan(${siswaId}, '${siswaName}', '${nextStatus}')">
                    <i class="fas fa-edit"></i> Edit Keterangan
                    </button>`;
                } else {
                    keteranganCell.innerHTML = '-';
                }
            }

            updateHadirCounter();
        });
    });
}

function getStatusText(status) {
    const statusMap = {
        'hadir': 'Hadir',
        'izin': 'Izin',
        'sakit': 'Sakit',
        'alpha': 'Alpha'
    };
    return statusMap[status] || 'Alpha';
}

function getStatusClass(status) {
    const classMap = {
        'hadir': 'status-hadir',
        'izin': 'status-izin',
        'sakit': 'status-sakit',
        'alpha': 'status-alpha'
    };
    return classMap[status] || 'status-alpha';
}

function getNextStatus(currentStatus) {
    const statusOrder = ['alpha', 'hadir', 'izin', 'sakit'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
}

function updateHadirCounter() {
    const badges = document.querySelectorAll('.status-badge');
    let hadirCount = 0;

    badges.forEach(badge => {
        if (badge.getAttribute('data-status') === 'hadir') {
            hadirCount++;
        }
    });

    document.getElementById('absensi-hadir').textContent = hadirCount;
}

// Fungsi untuk menyimpan absensi - YANG DIPERBAIKI
function simpanSemuaAbsensi() {
    const selectedKelas = getSelectedKelas();
    const selectedMapel = getSelectedMapel();
    const today = new Date().toISOString().split('T')[0];
    const key = `${selectedKelas.id}-${selectedMapel}-${today}`;

    const absensiData = getAbsensiData();
    const siswaData = getSiswaData();
    const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);

    const absensiHariIni = {
        tanggal: today,
        siswa: []
    };

    const rows = document.querySelectorAll('#siswa-list tr');
    rows.forEach(row => {
        const siswaId = parseInt(row.querySelector('.status-badge').getAttribute('data-siswa-id'));
        const status = row.querySelector('.status-badge').getAttribute('data-status');
        const waktuCell = row.querySelector('td:nth-child(5)').textContent;
        const waktu = status === 'hadir' && waktuCell !== '-' ? new Date().toISOString() : null;

        // Ambil keterangan dari sel ke-6 (hilangkan tombol jika ada)
        let keterangan = row.querySelector('td:nth-child(6)').textContent.trim();
        // Hilangkan teks "Edit Keterangan" jika ada
        keterangan = keterangan.replace('Edit Keterangan', '').trim();
        // Jika hanya ada "-", kosongkan
        if (keterangan === '-') keterangan = '';

        absensiHariIni.siswa.push({
            siswaId: siswaId,
            status: status,
            waktu: waktu,
            keterangan: keterangan
        });
    });

    absensiData[key] = absensiHariIni;
    saveAbsensiData(absensiData);

    // Tambahkan ke riwayat
    const riwayat = getRiwayatAbsensi();
    const hadirCount = absensiHariIni.siswa.filter(s => s.status === 'hadir').length;
    const tidakHadirCount = absensiHariIni.siswa.length - hadirCount;

    // PERBAIKAN: Gunakan timestamp unik untuk setiap entri riwayat
    const timestamp = new Date().getTime();

    // Cek apakah sudah ada entri untuk hari ini
    const existingTodayIndex = riwayat.findIndex(r =>
    r.kelasId === selectedKelas.id &&
    r.mapel === selectedMapel &&
    r.tanggal === today
    );

    if (existingTodayIndex !== -1) {
        // Jika sudah ada, tambahkan sebagai entri baru dengan timestamp berbeda
        riwayat.push({
            id: timestamp, // ID unik berdasarkan timestamp
            kelasId: selectedKelas.id,
            kelasName: selectedKelas.name,
            mapel: selectedMapel,
            tanggal: today,
            waktuSimpan: new Date().toLocaleTimeString('id-ID'),
                     jumlahSiswa: absensiHariIni.siswa.length,
                     hadir: hadirCount,
                     tidakHadir: tidakHadirCount
        });
    } else {
        // Jika belum ada, buat entri baru
        riwayat.push({
            id: timestamp,
            kelasId: selectedKelas.id,
            kelasName: selectedKelas.name,
            mapel: selectedMapel,
            tanggal: today,
            waktuSimpan: new Date().toLocaleTimeString('id-ID'),
                     jumlahSiswa: absensiHariIni.siswa.length,
                     hadir: hadirCount,
                     tidakHadir: tidakHadirCount
        });
    }

    saveRiwayatAbsensi(riwayat);

    alert('Data absensi berhasil disimpan!');
}

// Fungsi untuk membuka modal keterangan
function bukaModalKeterangan(siswaId, siswaName, currentStatus) {
    document.getElementById('keterangan-title').textContent = `Keterangan untuk ${siswaName}`;

    const statusDisplay = document.getElementById('keterangan-status-display');
    statusDisplay.textContent = getStatusText(currentStatus);
    statusDisplay.className = `status-badge ${getStatusClass(currentStatus)}`;

    document.getElementById('input-keterangan').value = '';

    // Simpan data siswa yang sedang diedit
    currentEditingSiswa = {
        id: siswaId,
        name: siswaName,
        status: currentStatus
    };

    document.getElementById('keterangan-modal').style.display = 'flex';
}

function tutupModalKeterangan() {
    document.getElementById('keterangan-modal').style.display = 'none';
    currentEditingSiswa = null;
}

function simpanKeterangan() {
    if (!currentEditingSiswa) return;

    const keterangan = document.getElementById('input-keterangan').value;

    // Update keterangan di tabel
    const rows = document.querySelectorAll('#siswa-list tr');
    rows.forEach(row => {
        const badge = row.querySelector('.status-badge');
        if (badge && parseInt(badge.getAttribute('data-siswa-id')) === currentEditingSiswa.id) {
            const keteranganCell = row.querySelector('td:nth-child(6)');
            // Hapus tombol edit yang lama
            const existingButton = keteranganCell.querySelector('button');
            if (existingButton) {
                existingButton.remove();
            }

            // Tambahkan keterangan dan tombol edit baru
            keteranganCell.innerHTML = keterangan || '-';
            if (currentEditingSiswa.status !== 'hadir' && currentEditingSiswa.status !== 'alpha') {
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-small btn-info mt-1';
                editButton.innerHTML = '<i class="fas fa-edit"></i> Edit Keterangan';
                editButton.onclick = () => bukaModalKeterangan(
                    currentEditingSiswa.id,
                    currentEditingSiswa.name,
                    currentEditingSiswa.status
                );
                keteranganCell.appendChild(editButton);
            }
        }
    });

    tutupModalKeterangan();
    alert('Keterangan berhasil disimpan!');
}

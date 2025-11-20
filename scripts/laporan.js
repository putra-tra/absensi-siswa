// Fungsi untuk menghapus riwayat absensi
function hapusRiwayatAbsensi(riwayatId) {
    if (confirm('Apakah Anda yakin ingin menghapus riwayat absensi ini?')) {
        // Hapus dari riwayat
        const riwayat = getRiwayatAbsensi();
        const updatedRiwayat = riwayat.filter(r => r.id !== riwayatId);
        saveRiwayatAbsensi(updatedRiwayat);

        // Hapus dari data absensi jika perlu
        const absensiData = getAbsensiData();
        const riwayatItem = riwayat.find(r => r.id === riwayatId);
        if (riwayatItem) {
            const key = `${riwayatItem.kelasId}-${riwayatItem.mapel}-${riwayatItem.tanggal}`;
            // Hanya hapus dari absensiData jika ini adalah satu-satunya entri untuk tanggal tersebut
            const countForDate = riwayat.filter(r =>
            r.kelasId === riwayatItem.kelasId &&
            r.mapel === riwayatItem.mapel &&
            r.tanggal === riwayatItem.tanggal
            ).length;

            if (countForDate <= 1) {
                delete absensiData[key];
                saveAbsensiData(absensiData);
            }
        }

        // Render ulang halaman laporan
        renderLaporanPage();
        alert('Riwayat absensi berhasil dihapus!');
    }
}

// Fungsi untuk render laporan
function renderLaporanPage() {
    const riwayat = getRiwayatAbsensi();
    const riwayatElement = document.getElementById('riwayat-absensi');
    riwayatElement.innerHTML = '';

    if (riwayat.length === 0) {
        riwayatElement.innerHTML = `
        <tr>
        <td colspan="7" class="text-center" style="padding: 2rem;">
        <i class="fas fa-clipboard-list" style="font-size: 2rem; color: var(--gray); margin-bottom: 1rem;"></i>
        <p>Belum ada riwayat absensi.</p>
        </td>
        </tr>
        `;
        return;
    }

    // Urutkan riwayat berdasarkan tanggal dan waktu simpan (terbaru di atas)
    riwayat.sort((a, b) => {
        const dateA = new Date(a.tanggal + ' ' + a.waktuSimpan);
        const dateB = new Date(b.tanggal + ' ' + b.waktuSimpan);
        return dateB - dateA;
    });

    riwayat.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${new Date(entry.tanggal).toLocaleDateString('id-ID')} ${entry.waktuSimpan ? `(${entry.waktuSimpan})` : ''}</td>
        <td>${entry.mapel}</td>
        <td>${entry.kelasName}</td>
        <td>${entry.jumlahSiswa}</td>
        <td>${entry.hadir}</td>
        <td>${entry.tidakHadir}</td>
        <td>
        <div class="action-buttons">
        <button class="btn btn-small btn-info export-single-pdf" data-id="${entry.id}">
        <i class="fas fa-file-pdf"></i> Ekspor
        </button>
        <button class="btn btn-small btn-danger hapus-riwayat" data-id="${entry.id}">
        <i class="fas fa-trash"></i> Hapus
        </button>
        </div>
        </td>
        `;
        riwayatElement.appendChild(row);
    });

    // Event listener untuk hapus riwayat
    document.querySelectorAll('.hapus-riwayat').forEach(button => {
        button.addEventListener('click', function() {
            const riwayatId = parseInt(this.getAttribute('data-id'));
            hapusRiwayatAbsensi(riwayatId);
        });
    });

    // Event listener untuk ekspor PDF per entri
    document.querySelectorAll('.export-single-pdf').forEach(button => {
        button.addEventListener('click', function() {
            const riwayatId = parseInt(this.getAttribute('data-id'));
            const riwayat = getRiwayatAbsensi();
            const entry = riwayat.find(r => r.id === riwayatId);

            if (entry) {
                exportPDF(entry.kelasId, entry.mapel, entry.tanggal, entry.id);
            }
        });
    });
}

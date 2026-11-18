/* ============================================================
   RuangPintar — rangkuman.js
   Fitur Tahap 1 (Rank 4 Survey: Knowledge Retention & Cheat Sheet)
   Rangkuman Kilat, Rumus Cepat & Jembatan Keledai SMA (IPA & IPS)
   ============================================================ */

const Rangkuman = (() => {

    const STORAGE_KEY = 'ruangpintar_hafalan_v1';

    // State lokal hafalan
    let memorizedIds = [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) memorizedIds = JSON.parse(saved);
    } catch (e) {
        memorizedIds = [];
    }

    let activeSubject = 'Semua';
    let searchQuery = '';

    // Database Rangkuman Kilat: Rumus & Konsep Kunci SMA
    const CHEAT_SHEETS = [
        // ================= FISIKA =================
        {
            id: 'fis_glbb',
            subject: 'Fisika',
            grade: 'Kelas X',
            track: 'ipa',
            title: 'Gerak Lurus (GLB & GLBB)',
            formula: 's = v·t\nvₜ = v₀ + a·t\ns = v₀·t + ½a·t²\nvₜ² = v₀² + 2a·s',
            mnemonic: '⚡ vₜ = vo + at | s = vo·t + ½at² (Ingat: a bertanda minus jika pengereman/perlambatan)',
            keys: [
                'GLB: Kecepatan tetap (v konstan), percepatan nol (a = 0).',
                'GLBB: Percepatan tetap (a konstan). Jika gerak jatuh bebas: v₀ = 0 dan a = g (10 m/s²).',
                'vₜ = kecepatan akhir (m/s), v₀ = kecepatan awal (m/s), s = jarak tempuh (m).'
            ],
            example: 'Mobil ngerem dari 20 m/s hingga berhenti dalam 4 detik → a = (0 - 20)/4 = -5 m/s².'
        },
        {
            id: 'fis_newton',
            subject: 'Fisika',
            grade: 'Kelas X',
            track: 'ipa',
            title: 'Hukum Newton & Gaya',
            formula: 'ΣF = 0 (Hk. I)\nΣF = m·a (Hk. II)\nF_aksi = -F_reaksi (Hk. III)\nf_s ≤ μ_s·N  |  f_k = μ_k·N',
            mnemonic: '🍎 Hukum I: Inersia (malas gerak). Hukum II: Dorong massa (F=ma). Hukum III: Aksi-Reaksi berlawanan arah.',
            keys: [
                'Gaya gesek statis (f_s) menahan benda agar tidak bergeser; kinetis (f_k) saat sudah meluncur.',
                'Gaya normal (N) selalu tegak lurus bidang sentuh (pada bidang datar horizontal: N = W = m·g).',
                'Gaya aksi dan reaksi bekerja pada DUA BENDA YANG BERBEDA, bukan saling meniadakan!'
            ],
            example: 'Balok 5 kg ditarik gaya 25 N di lantai licin → a = F/m = 25 / 5 = 5 m/s².'
        },
        {
            id: 'fis_energi',
            subject: 'Fisika',
            grade: 'Kelas X',
            track: 'ipa',
            title: 'Usaha & Energi Mekanik',
            formula: 'W = F·s·cos(θ)\nEk = ½m·v²\nEp = m·g·h\nEm = Ek + Ep = Konstan',
            mnemonic: '🔋 Usaha nol jika gaya tegak lurus perpindahan (cos 90° = 0), misal bawa tas sambil jalan mendatar.',
            keys: [
                'Hukum Kekekalan Energi Mekanik berlaku selama HANYA gaya gravitasi (konservatif) yang bekerja.',
                'Di titik tertinggi jatuh bebas: Ek = 0, Ep = Maksimum. Di dasar: Ep = 0, Ek = Maksimum.',
                'Hubungan Usaha-Energi: W = ΔEk = Ek₂ - Ek₁.'
            ],
            example: 'Kelapa 2 kg jatuh dari 10 m (g=10) → Kecepatan sebelum menyentuh tanah v = √(2gh) = √(200) ≈ 14,1 m/s.'
        },

        // ================= MATEMATIKA =================
        {
            id: 'mat_kuadrat',
            subject: 'Matematika',
            grade: 'Kelas X',
            track: 'all',
            title: 'Persamaan & Fungsi Kuadrat',
            formula: 'x₁,₂ = (-b ± √D) / (2a)\nD = b² - 4ac\nxₚ = -b / (2a)\nyₚ = -D / (4a)',
            mnemonic: '🎯 D > 0 (2 akar beda) | D = 0 (1 akar kembar/menyinggung) | D < 0 (melayang/tak ada akar real).',
            keys: [
                'Arah Parabola: a > 0 terbuka ke atas (punya nilai minimum); a < 0 terbuka ke bawah (punya nilai maksimum).',
                'Rumus Vieta (Jumlah & Hasil Kali Akar): x₁ + x₂ = -b/a, dan x₁ · x₂ = c/a.',
                'Definit Positif: a > 0 dan D < 0 (grafik selalu di atas sumbu-X).'
            ],
            example: 'x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x₁ = 2, x₂ = 3. Jumlah = 5, Kali = 6.'
        },
        {
            id: 'mat_trigo',
            subject: 'Matematika',
            grade: 'Kelas X',
            track: 'all',
            title: 'Trigonometri Segitiga Siku-siku',
            formula: 'sin θ = de / mi\ncos θ = sa / mi\ntan θ = de / sa\nsin²θ + cos²θ = 1',
            mnemonic: '📐 DeMi (Sin), SaMi (Cos), DeSa (Tan). Sindikat Desa Suka Mengintai.',
            keys: [
                'Sudut Istimewa Sin: 0°(0), 30°(½), 45°(½√2), 60°(½√3), 90°(1).',
                'Sudut Istimewa Cos: kebalikan Sin (90° sampai 0°).',
                'Kuadran: All (I), Sin (II), Tan (III), Cos (IV) → Jembatan: "Semua Sindikat Tangan Kosong".'
            ],
            example: 'Segitiga sisi miring 10 m, sudut 30° → Sisi depan = 10 · sin(30°) = 10 · ½ = 5 m.'
        },
        {
            id: 'mat_statistika',
            subject: 'Matematika',
            grade: 'Kelas XII',
            track: 'all',
            title: 'Statistika: Ukuran Pemusatan Data',
            formula: 'Mean (x̄) = Σx / n\nMedian (Me) = Nilai tengah urut\nModus (Mo) = Frekuensi terbanyak\nJangkauan = X_max - X_min',
            mnemonic: '📊 Mean = Rata-rata bagi total, Median = Belah tengah data yang sudah diurutkan, Modus = Terpopuler.',
            keys: [
                'Wajib urutkan data dari kecil ke besar sebelum mencari Median & Kuartil!',
                'Untuk n genap, Median adalah rata-rata dari dua nilai di tengah.',
                'Kuartil membagi data jadi 4 bagian sama: Q1 (bawah), Q2 (median), Q3 (atas).'
            ],
            example: 'Data [3, 5, 7, 8, 9] (n=5) → Mean = 32/5 = 6,4 | Median = 7 (nilai ke-3).'
        },

        // ================= KIMIA =================
        {
            id: 'kim_mol',
            subject: 'Kimia',
            grade: 'Kelas X',
            track: 'ipa',
            title: 'Jembatan Mol & Stoikiometri',
            formula: 'n = gram / Mr\nJumlah Partikel = n · 6,02×10²³\nVolume STP (0°C, 1 atm) = n · 22,4 L\nMolaritas (M) = n / Volume(L)',
            mnemonic: '🧪 Semua jalan lewat Mol (n)! Mau cari massa, partikel, atau volume gas: jadikan MOL dulu.',
            keys: [
                'Bilangan Avogadro: L = 6,02 × 10²³ partikel/mol.',
                'Volume molar gas ideal pada STP selalu 22,4 Liter/mol.',
                'Persamaan Gas Ideal Non-STP: P·V = n·R·T (R = 0,082 L·atm/mol·K, T dalam Kelvin).'
            ],
            example: '4 gram NaOH (Mr=40) → n = 4/40 = 0,1 mol. Volume STP jika berbentuk gas = 0,1 × 22,4 = 2,24 L.'
        },
        {
            id: 'kim_atom',
            subject: 'Kimia',
            grade: 'Kelas X',
            track: 'ipa',
            title: 'Struktur Atom & Sistem Periodik',
            formula: 'Nomor Atom (Z) = Jumlah Proton = Jumlah Elektron\nNomor Massa (A) = Proton + Neutron\nNeutron = A - Z\nMax elektron kulit = 2n²',
            mnemonic: '⚛️ Golongan = Elektron Valensi (elektron terluar) | Periode = Jumlah Kulit Terisi.',
            keys: [
                'Kapasitas kulit atom: K=2, L=8, M=18, N=32 (aturan 2n²).',
                'Kaidah Oktet: Atom stabil jika elektron valensinya 8 (seperti gas mulia VIIIA), atau Duplet (2 seperti Helium).',
                'Isotop: Z sama, A beda (unsur sama, massa beda). Isobar: A sama, Z beda. Isoton: Neutron sama.'
            ],
            example: '₁₁Na²³: Proton = 11, Elektron = 11, Neutron = 23 - 11 = 12. Konfigurasi 2, 8, 1 → Golongan IA, Periode 3.'
        },

        // ================= BIOLOGI =================
        {
            id: 'bio_sel',
            subject: 'Biologi',
            grade: 'Kelas XI',
            track: 'ipa',
            title: 'Organel Sel & Transpor Membran',
            formula: 'Transpor Pasif: Difusi (tinggi → rendah, no ATP)\nTranspor Aktif: Lawan gradien (butuh ATP)\nOsmosis: Air gerak dari hipotonis → hipertonis',
            mnemonic: '🧫 Mitokondria = Powerhouse (bikin ATP) | Ribosom = Pabrik Protein | Kloroplas = Fotosintesis.',
            keys: [
                'Sel Hewan vs Sel Tumbuhan: Tumbuhan punya Dinding Sel, Vakuola besar, & Kloroplas (Hewan punya Sentriol).',
                'Plasmolisis: Sel tumbuhan mengkerut karena direndam cairan hipertonis (pekat).',
                'Lisis: Sel darah merah pecah saat direndam air murni (hipotonis) karena air masuk terus.'
            ],
            example: 'Sirup larut dalam air = Difusi biasa. Kentang merenyah dalam air garam pekat = Osmosis air keluar sel.'
        },
        {
            id: 'bio_mitosis',
            subject: 'Biologi',
            grade: 'Kelas XII',
            track: 'ipa',
            title: 'Pembelahan Sel & Hukum Mendel',
            formula: 'Mitosis: 2n → 2n (2 sel anak identik)\nMeiosis: 2n → n (4 sel gamet haploid)\nRasio F2 Monohibrid: 3 : 1 (fenotip)\nRasio F2 Dihibrid: 9 : 3 : 3 : 1',
            mnemonic: '🧬 Jembatan Urutan Mitosis: "PAK MAMAT" → Profase, Metafase (sejajar di tengah), Anafase (ditarik ke kutub), Telofase (membelah dua).',
            keys: [
                'Mitosis untuk pertumbuhan dan perbaikan jaringan tubuh (sel somatik).',
                'Meiosis terjadi di organ reproduksi untuk pembentukan sel kelamin (sperma/ovum).',
                'Pindah Silang (Crossing Over) terjadi pada tahap Profase I Meiosis sehingga menghasilkan variasi genetik.'
            ],
            example: 'Persilangan mawar Merah (MM) x Putih (mm) menghasilkan F1 Merah (Mm). Jika F1 disilangkan sesamanya, rasio fenotip F2: 3 Merah : 1 Putih.'
        },

        // ================= EKONOMI (IPS) =================
        {
            id: 'eko_permintaan',
            subject: 'Ekonomi',
            grade: 'Kelas X',
            track: 'ips',
            title: 'Hukum Permintaan, Penawaran & Pasar',
            formula: 'Keseimbangan: Q_d = Q_s  atau  P_d = P_s\nFungsi Permintaan: P - P₁ / P₂ - P₁ = Q - Q₁ / Q₂ - Q₁\nElastisitas (Ed) = (%ΔQ) / (%ΔP)',
            mnemonic: '💰 Permintaan: Harga naik, orang pelit (beli dikit, lereng negatif). Penawaran: Harga naik, toko untung (jual banyak, lereng positif).',
            keys: [
                'Keseimbangan Pasar (Equilibrium) tercipta saat kurva permintaan dan penawaran berpotongan.',
                'Ceteris Paribus: Faktor-faktor lain dianggap tetap.',
                'Elastis (Ed > 1): Perubahan harga sedikit memicu lonjakan jumlah beli besar (barang mewah).'
            ],
            example: 'Diketahui Qd = 100 - 2P dan Qs = 20 + 2P → 100 - 2P = 20 + 2P → 4P = 80 → Harga Ekuilibrium P = Rp 20.'
        },
        {
            id: 'eko_pendapatan',
            subject: 'Ekonomi',
            grade: 'Kelas XI',
            track: 'ips',
            title: 'Pendapatan Nasional & Inflasi',
            formula: 'Pengeluaran: Y = C + I + G + (X - M)\nPendapatan: Y = r + w + i + p\nLaju Inflasi = ((IHK_t - IHK_t-1) / IHK_t-1) × 100%',
            mnemonic: '📈 Jembatan Pengeluaran: "C-I-G-X-M" → Konsumsi Rumah Tangga (C), Investasi (I), Belanja Pemerintah (G), Ekspor Netto (X-M).',
            keys: [
                'GNP = GDP + Pendapatan Neto Luar Negeri.',
                'Pendapatan Nasional Pendekatan Pendapatan: sewa (rent), upah (wage), bunga (interest), laba (profit).',
                'Kebijakan Moneter Atasi Inflasi: Naikkan suku bunga (BI rate), naikkan cadangan kas bank, jual SBI.'
            ],
            example: 'Jika Konsumsi C=500, Investasi I=200, Belanja Negara G=300, Ekspor X=150, Impor M=100 → Y = 500+200+300+(150-100) = 1.050 T.'
        },

        // ================= SOSIOLOGI (IPS) =================
        {
            id: 'sos_interaksi',
            subject: 'Sosiologi',
            grade: 'Kelas X',
            track: 'ips',
            title: 'Interaksi & Proses Sosial',
            formula: 'Syarat Interaksi = Kontak Sosial + Komunikasi\nBentuk = Asosiatif (Menyatukan) vs Disosiatif (Memecah)',
            mnemonic: '👥 Asosiatif: Kerjasama, Akomodasi (damai), Asimilasi (lebur budaya baru), Akulturasi (baur tanpa hilang asli). Disosiatif: Konflik, Kontravensi, Kompetisi.',
            keys: [
                'Kontak Sosial dapat berupa primer (tatap muka langsung) atau sekunder (lewat perantara/ponsel).',
                'Kontravensi adalah bentuk disosiatif berupa rasa tidak senang tersembunyi, penyangkalan, atau sabotase.',
                'Akomodasi adalah cara meredakan konflik (Mediasi = pihak ketiga netral penasihat, Arbitrasi = pihak ketiga pemutus putusan).'
            ],
            example: 'Mediasi: Guru BK mendamaikan dua murid yang bertengkar tanpa memaksakan hukuman hakiki.'
        },
        {
            id: 'sos_stratifikasi',
            subject: 'Sosiologi',
            grade: 'Kelas XI',
            track: 'ips',
            title: 'Diferensiasi vs Stratifikasi Sosial',
            formula: 'Diferensiasi = Horizontal (Sejajar, tanpa kasta)\nStratifikasi = Vertikal (Tingkatan kelas hierarkis)',
            mnemonic: '⚖️ Diferensiasi: Suku, Ras, Agama (setara). Stratifikasi: Kekayaan, Pendidikan, Kekuasaan, Kasta (ada atas & bawah).',
            keys: [
                'Stratifikasi Terbuka: Seseorang bisa naik/turun kelas melalui usaha/pendidikan (mobilitas sosial dinamis).',
                'Stratifikasi Tertutup: Posisi sosial ditentukan sejak lahir (sistem kasta feodal, warisan bangsawan).',
                'Primordialisme: Sikap mengagungkan ikatan bawaan sejak lahir (suku/kelompok sendiri) secara berlebihan.'
            ],
            example: 'Anak petani berhasil kuliah menjadi dokter spesialis merupakan contoh Mobilitas Sosial Vertikal Naik.'
        },

        // ================= GEOGRAFI (IPS) =================
        {
            id: 'geo_litosfer',
            subject: 'Geografi',
            grade: 'Kelas X',
            track: 'ips',
            title: 'Litosfer & Tenaga Endogen-Eksogen',
            formula: 'Endogen = Berasal dari dalam bumi (Tektonisme, Vulkanisme, Seisme)\nEksogen = Dari luar (Pelapukan, Erosi, Sedimentasi)\nSkala Gempa L = ((S - P) - 1 menit) × 1.000 km',
            mnemonic: '🌍 Batas Lempeng: Konvergen (Tubrukan/Gunung api), Divergen (Saling Menjauh/Mid-ocean ridge), Sesar Transform (Geser Mendatar/Patahan San Andreas).',
            keys: [
                'Wilayah Indonesia rawan gempa dan gunung api karena berada di titik temu 3 lempeng aktif (Eurasia, Indo-Australia, Pasifik).',
                'Rumus Laska: Menentukan jarak episentrum gempa bumi dari stasiun pencatat gelombang primer (P) dan sekunder (S).',
                'Pelapukan batuan terbagi menjadi: Mekanik/Fisika (suhu), Kimiawi (air/hujan asam), Organik (akar tumbuhan).'
            ],
            example: 'Gelombang S tercatat 10.35 dan P tercatat 10.32 → Selisih 3 menit → Jarak = (3 - 1) × 1.000 = 2.000 km.'
        },

        // ================= SEJARAH (IPS) =================
        {
            id: 'sej_proklamasi',
            subject: 'Sejarah',
            grade: 'Kelas XI',
            track: 'all',
            title: 'Detik-Detik Proklamasi 17 Agustus 1945',
            formula: 'Kronologi Kunci:\n6 & 9 Ags: Bom Atom Hiroshima & Nagasaki\n15 Ags: Jepang Menyerah ke Sekutu\n16 Ags: Rengasdengklok (Desakan Pemuda)\n17 Ags: Pembacaan Proklamasi di Jl. Pegangsaan Timur 56',
            mnemonic: '🏛️ Jembatan Tokoh: Sayuti Melik (Ketik Naskah), Ibu Fatmawati (Jahit Merah Putih), Latief Hendraningrat & Suhud (Kibar Bendera).',
            keys: [
                'Peristiwa Rengasdengklok: Golongan muda (Sukarni, Chaerul Saleh) mengamankan Soekarno-Hatta agar proklamasi bebas pengaruh Jepang.',
                'Naskah Proklamasi dirumuskan di kediaman Laksamana Tadashi Maeda (perwira AL Jepang yang bersimpati pada perjuangan RI).',
                'Makna Proklamasi: Puncak perjuangan de facto & de jure mengakhiri era kolonialisme di nusantara.'
            ],
            example: 'Konsep dasar naskah proklamasi disusun oleh Soekarno, Hatta, dan Achmad Soebardjo di ruang makan Laksamana Maeda.'
        }
    ];

    // Filter daftar sesuai jurusan siswa
    function getVisibleCards() {
        const state = typeof App !== 'undefined' ? App.getState() : { track: 'ipa' };
        const userTrack = (state.track || 'ipa').toLowerCase();
        return CHEAT_SHEETS.filter(c => c.track === 'all' || c.track === userTrack);
    }

    // Toggle Hafalan
    function toggleHafal(id) {
        const idx = memorizedIds.indexOf(id);
        if (idx >= 0) {
            memorizedIds.splice(idx, 1);
            if (typeof App !== 'undefined') App.showToast('Belum dihafal, yuk baca ulang lagi! 💪');
        } else {
            memorizedIds.push(id);
            if (typeof App !== 'undefined') {
                App.addXP(15);
                App.showToast('⭐ Keren! 1 Rumus ditandai hafal (+15 XP)');
            }
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memorizedIds));
        } catch (e) {}

        render();
    }

    // Salin rumus/konsep ke clipboard
    function copyFormula(id) {
        const item = CHEAT_SHEETS.find(c => c.id === id);
        if (!item) return;

        const textToCopy = `📌 [Rangkuman ${item.subject} SMA - RuangPintar]\n${item.title}\n\n⚡ RUMUS UTAMA:\n${item.formula}\n\n💡 TIPS / JEMBATAN KELEDAI:\n${item.mnemonic}\n\n🔑 POIN KUNCI:\n${item.keys.map(k => '• ' + k).join('\n')}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (typeof App !== 'undefined') App.showToast('📋 Rumus berhasil disalin ke clipboard!');
            }).catch(() => fallbackCopy(textToCopy));
        } else {
            fallbackCopy(textToCopy);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            if (typeof App !== 'undefined') App.showToast('📋 Rumus berhasil disalin!');
        } catch (e) {
            if (typeof App !== 'undefined') App.showToast('⚠️ Gagal menyalin, peramban tidak mendukung');
        }
        document.body.removeChild(ta);
    }

    // Set filter mata pelajaran
    function setSubject(sub) {
        activeSubject = sub;
        render();
    }

    // Filter teks pencarian
    function onSearch(query) {
        searchQuery = query.toLowerCase().trim();
        renderListOnly();
    }

    // Cetak / Print Cheat Sheet
    function printCheatSheet() {
        window.print();
    }

    // Render Utama
    function render() {
        const page = document.getElementById('page-rangkuman');
        if (!page) return;

        const visibleCards = getVisibleCards();
        const subjects = ['Semua', ...new Set(visibleCards.map(c => c.subject))];

        const totalCards = visibleCards.length;
        const totalMemorized = visibleCards.filter(c => memorizedIds.includes(c.id)).length;
        const percentMemorized = totalCards > 0 ? Math.round((totalMemorized / totalCards) * 100) : 0;

        page.innerHTML = `
            <div class="rangkuman-view">
                <!-- Navigation Switcher antara Modul Interaktif & Rangkuman Kilat -->
                <div class="materi-mode-tabs">
                    <button class="materi-mode-tab" onclick="App.navigate('materi')">📖 Modul Interaktif</button>
                    <button class="materi-mode-tab active" onclick="App.navigate('rangkuman')">⚡ Rangkuman & Cheat Sheet</button>
                </div>

                <!-- Hero Banner Rangkuman -->
                <div class="rangkuman-hero">
                    <div class="rh-left">
                        <div class="rh-tag">⚡ Solusi Survey Rank 4 (Skor 3.26)</div>
                        <h2 class="rh-title">Rangkuman Kilat & Rumus Cepat</h2>
                        <p class="rh-desc">Cheat sheet rumus penting, jembatan keledai, dan konsep esensial SMA siap pakai H-1 ujian tanpa pusing buka buku tebal!</p>
                    </div>
                    <div class="rh-actions">
                        <button class="btn btn-outline btn-sm rh-print-btn" onclick="Rangkuman.printCheatSheet()" title="Cetak atau simpan sebagai PDF">
                            🖨️ Cetak / PDF
                        </button>
                    </div>
                </div>

                <!-- Progress Tracker Hafalan Siswa -->
                <div class="hafal-tracker-card">
                    <div class="htc-info">
                        <div class="htc-title">
                            <span>🧠 Tracker Hafalan Rumus</span>
                            <span class="htc-score">${totalMemorized} / ${totalCards} Dihafal (${percentMemorized}%)</span>
                        </div>
                        <div class="progress-bar" style="height:10px; margin-top:8px;">
                            <div class="progress-fill" style="width: ${percentMemorized}%; background: var(--gradient-secondary);"></div>
                        </div>
                    </div>
                    <div class="htc-badge">
                        ${percentMemorized === 100 ? '👑 Master Rumus!' : percentMemorized >= 50 ? '🔥 Mantap, Terus Lanjut!' : '🌱 Ayo Mulai Hafalkan!'}
                    </div>
                </div>

                <!-- Search & Filters -->
                <div class="rangkuman-controls">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="rangkuman-search" placeholder="Cari rumus atau konsep... (misal: GLBB, mol, trigonometri, inflasi)" 
                               value="${searchQuery}" oninput="Rangkuman.onSearch(this.value)">
                        ${searchQuery ? `<button class="clear-search-btn" onclick="Rangkuman.clearSearch()">✕</button>` : ''}
                    </div>

                    <div class="chip-row">
                        ${subjects.map(s => {
                            const icon = s === 'Semua' ? '🌟' : getSubjectIcon(s);
                            const count = s === 'Semua' ? visibleCards.length : visibleCards.filter(c => c.subject === s).length;
                            return `
                                <button class="chip ${activeSubject === s ? 'active' : ''}" onclick="Rangkuman.setSubject('${s}')">
                                    ${icon} ${s} (${count})
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Container Kartu-Kartu Rumus -->
                <div id="rangkuman-grid" class="rangkuman-grid">
                    ${renderCardsHtml(visibleCards)}
                </div>
            </div>
        `;
    }

    function clearSearch() {
        searchQuery = '';
        const input = document.getElementById('rangkuman-search');
        if (input) input.value = '';
        renderListOnly();
    }

    function renderListOnly() {
        const grid = document.getElementById('rangkuman-grid');
        if (!grid) return;
        grid.innerHTML = renderCardsHtml(getVisibleCards());
    }

    function renderCardsHtml(cards) {
        let filtered = cards;
        if (activeSubject !== 'Semua') {
            filtered = filtered.filter(c => c.subject === activeSubject);
        }
        if (searchQuery) {
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(searchQuery) ||
                c.subject.toLowerCase().includes(searchQuery) ||
                c.formula.toLowerCase().includes(searchQuery) ||
                c.mnemonic.toLowerCase().includes(searchQuery) ||
                c.keys.some(k => k.toLowerCase().includes(searchQuery))
            );
        }

        if (filtered.length === 0) {
            return `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
                    <h3>Rumus atau konsep tidak ditemukan</h3>
                    <p style="color: var(--text-secondary);">Coba kata kunci lain atau pilih filter mata pelajaran yang berbeda.</p>
                </div>
            `;
        }

        return filtered.map(item => {
            const isMemorized = memorizedIds.includes(item.id);
            const icon = getSubjectIcon(item.subject);

            return `
                <div class="cheat-card ${isMemorized ? 'memorized' : ''}" id="card-${item.id}">
                    <div class="cc-header">
                        <div class="cc-badge-group">
                            <span class="badge badge-primary">${icon} ${item.subject}</span>
                            <span class="badge badge-outline">${item.grade}</span>
                        </div>
                        <div class="cc-actions">
                            <button class="hafal-btn ${isMemorized ? 'active' : ''}" onclick="Rangkuman.toggleHafal('${item.id}')" title="${isMemorized ? 'Tandai belum hafal' : 'Tandai sudah hafal'}">
                                ${isMemorized ? '⭐ Sudah Hafal' : '☆ Tandai Hafal'}
                            </button>
                            <button class="copy-btn" onclick="Rangkuman.copyFormula('${item.id}')" title="Salin rumus ke clipboard">
                                📋
                            </button>
                        </div>
                    </div>

                    <h3 class="cc-title">${item.title}</h3>

                    <!-- Kotak Rumus / Formula Utama -->
                    <div class="formula-box">
                        <div class="fb-tag">⚡ Rumus / Konsep Utama</div>
                        <pre class="fb-content">${item.formula}</pre>
                    </div>

                    <!-- Mnemonic / Jembatan Keledai Cepat Hafal -->
                    <div class="mnemonic-box">
                        <span class="mb-icon">💡</span>
                        <div class="mb-text">${item.mnemonic}</div>
                    </div>

                    <!-- Poin Kunci Ringkas -->
                    <div class="keys-list">
                        <div class="kl-label">🔑 Poin Penting Ujian:</div>
                        <ul>
                            ${item.keys.map(k => `<li>${k}</li>`).join('')}
                        </ul>
                    </div>

                    ${item.example ? `
                        <div class="example-box">
                            <span class="eb-badge">Contoh Cepat:</span>
                            <span class="eb-text">${item.example}</span>
                        </div>
                    ` : ''}

                    <div class="cc-footer">
                        <button class="btn-ask-ai-mini" onclick="AITutor.askAbout('Tolong jelaskan lebih dalam tentang rumus & konsep ${item.subject}: ${item.title}')">
                            🤖 Tanya AI Tutor tentang rumus ini →
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getSubjectIcon(subject) {
        const icons = {
            'Fisika': '🚀',
            'Matematika': '📈',
            'Kimia': '⚛️',
            'Biologi': '🧫',
            'Ekonomi': '💰',
            'Sosiologi': '👥',
            'Geografi': '🌍',
            'Sejarah': '🏛️'
        };
        return icons[subject] || '📘';
    }

    return {
        render,
        setSubject,
        onSearch,
        clearSearch,
        toggleHafal,
        copyFormula,
        printCheatSheet
    };

})();

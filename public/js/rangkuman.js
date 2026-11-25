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
            if (typeof App !== 'undefined') App.showToast('Tanda hafal dihapus');
        } else {
            memorizedIds.push(id);
            if (typeof App !== 'undefined') {
                App.addXP(15, true);
                App.showToast('Ditandai hafal · +15 XP');
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
                if (typeof App !== 'undefined') App.showToast('Rumus disalin');
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
            if (typeof App !== 'undefined') App.showToast('Rumus disalin');
        } catch (e) {
            if (typeof App !== 'undefined') App.showToast('Gagal menyalin di browser ini');
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

    function getFilteredCards(cards) {
        let filtered = cards || getVisibleCards();
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
        return filtered;
    }

    function buildPrintHeaderHtml() {
        const s = typeof App !== 'undefined' ? App.getState() : {};
        const acc = s.account || {};
        const nama = acc.nama || s.studentName || 'Siswa';
        const info = [acc.kelas, acc.sekolah, acc.nisn ? 'NISN ' + acc.nisn : ''].filter(Boolean).join(' · ');
        const mapel = activeSubject === 'Semua' ? (s.track === 'ips' ? 'Semua Mapel IPS' : 'Semua Mapel IPA') : activeSubject;
        const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        return `
            <div class="ph-top">
                <div><strong>RuangPintar</strong> · Rangkuman & Rumus SMA</div>
                <div>${tgl}</div>
            </div>
            <div class="ph-meta">${nama}${info ? ' (' + info + ')' : ''} · ${mapel}</div>`;
    }

    // Cetak / Print PDF
    function printCheatSheet() {
        const ph = document.getElementById('rangkuman-print-header');
        if (ph) ph.innerHTML = buildPrintHeaderHtml();

        const html = document.documentElement;
        const prevTheme = html.getAttribute('data-theme') || 'dark';
        html.setAttribute('data-theme', 'light');

        let restored = false;
        const restore = () => {
            if (restored) return;
            restored = true;
            html.setAttribute('data-theme', prevTheme);
            window.removeEventListener('afterprint', restore);
        };
        window.addEventListener('afterprint', restore);

        if (typeof window.print === 'function') {
            try {
                window.print();
            } catch (e) {
                restore();
                downloadCheatSheet();
                return;
            }
            setTimeout(restore, 1500);
        } else {
            restore();
            downloadCheatSheet();
        }
    }

    // Unduh versi HTML siap cetak (fallback paling aman di HP / in-app browser)
    function downloadCheatSheet() {
        const cards = getFilteredCards();
        if (!cards.length) {
            if (typeof App !== 'undefined') App.showToast('Tidak ada rangkuman untuk diunduh');
            return;
        }
        const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const body = cards.map(item => `
            <article class="card">
                <div class="meta">${esc(item.subject)} · ${esc(item.grade)}</div>
                <h2>${esc(item.title)}</h2>
                <pre class="formula">${esc(item.formula)}</pre>
                <p class="memo"><b>Cara ingat:</b> ${esc(item.mnemonic.replace(/^\S+\s/, m => /[A-Za-z0-9]/.test(m) ? m : ''))}</p>
                <ul>${item.keys.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
                ${item.example ? `<p class="ex"><b>Contoh:</b> ${esc(item.example)}</p>` : ''}
            </article>`).join('');

        const doc = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Rangkuman RuangPintar</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:780px;margin:24px auto;padding:0 16px;line-height:1.5}
.head{border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:18px;font-size:13px;color:#444}
.head strong{font-size:16px;color:#111}
.card{border:1px solid #d1d5db;border-radius:10px;padding:14px 16px;margin-bottom:14px;break-inside:avoid}
.meta{font-size:11px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:.04em}
h2{margin:4px 0 10px;font-size:16px}
.formula{background:#f3f4f6;border-left:3px solid #4f46e5;padding:10px 12px;border-radius:6px;font-family:Consolas,monospace;font-size:13px;white-space:pre-wrap;margin:0 0 10px}
.memo{background:#fffbeb;border:1px solid #fcd34d;padding:8px 10px;border-radius:6px;font-size:12.5px;margin:0 0 8px}
ul{margin:0 0 8px;padding-left:18px;font-size:12.5px}
.ex{font-size:12px;color:#374151;margin:0}
@media print{body{margin:0;max-width:100%}.no-print{display:none}}
</style></head><body>
<div class="head">${buildPrintHeaderHtml()}</div>
<p class="no-print" style="margin-bottom:16px"><button onclick="window.print()" style="padding:8px 14px;font-weight:700;cursor:pointer">Cetak / Simpan PDF</button></p>
${body}</body></html>`;

        const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rangkuman-RuangPintar-${activeSubject.toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        if (typeof App !== 'undefined') App.showToast('File rangkuman diunduh');
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
                <div class="print-header" id="rangkuman-print-header">${buildPrintHeaderHtml()}</div>

                <!-- Navigation Switcher antara Modul Interaktif & Rangkuman Kilat -->
                <div class="materi-mode-tabs">
                    <button class="materi-mode-tab" onclick="App.navigate('materi')">Modul interaktif</button>
                    <button class="materi-mode-tab active" onclick="App.navigate('rangkuman')">Rangkuman</button>
                </div>

                <!-- Hero Banner Rangkuman -->
                <div class="rangkuman-hero">
                    <div class="rh-left">
                        <h2 class="rh-title">Rangkuman & rumus</h2>
                        <p class="rh-desc">Rumus penting plus cara gampang ngingetnya, dirangkum per bab. Tandai yang udah hafal biar kelihatan mana yang masih perlu diulang.</p>
                    </div>
                    <div class="rh-actions">
                        <button class="btn btn-outline btn-sm rh-print-btn" onclick="Rangkuman.printCheatSheet()" title="Cetak atau simpan sebagai PDF">
                            Cetak / PDF
                        </button>
                        <button class="btn btn-secondary btn-sm rh-print-btn" onclick="Rangkuman.downloadCheatSheet()" title="Unduh file siap cetak untuk dibuka offline">
                            Unduh (.html)
                        </button>
                    </div>
                </div>

                <!-- Progress Tracker Hafalan Siswa -->
                <div class="hafal-tracker-card">
                    <div class="htc-info">
                        <div class="htc-title">
                            <span>Progres hafalan</span>
                            <span class="htc-score">${totalMemorized} dari ${totalCards} (${percentMemorized}%)</span>
                        </div>
                        <div class="progress-bar" style="height:10px; margin-top:8px;">
                            <div class="progress-fill" style="width: ${percentMemorized}%; background: var(--gradient-secondary);"></div>
                        </div>
                    </div>
                    <div class="htc-badge">
                        ${percentMemorized === 100 ? 'Semua udah hafal' : percentMemorized >= 50 ? 'Lewat setengah jalan' : totalMemorized > 0 ? 'Lanjutin terus' : 'Belum ada yang ditandai'}
                    </div>
                </div>

                <!-- Search & Filters -->
                <div class="rangkuman-controls">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                        <input type="text" id="rangkuman-search" placeholder="Cari rumus, misal: GLBB, mol, inflasi" 
                               value="${searchQuery}" oninput="Rangkuman.onSearch(this.value)">
                        ${searchQuery ? `<button class="clear-search-btn" onclick="Rangkuman.clearSearch()">✕</button>` : ''}
                    </div>

                    <div class="chip-row">
                        ${subjects.map(s => {
                            const count = s === 'Semua' ? visibleCards.length : visibleCards.filter(c => c.subject === s).length;
                            return `
                                <button class="chip ${activeSubject === s ? 'active' : ''}" onclick="Rangkuman.setSubject('${s}')">
                                    ${s} <span class="chip-count">${count}</span>
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
        const filtered = getFilteredCards(cards);

        if (filtered.length === 0) {
            return `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center;">
                    <h3>Rumus atau konsep tidak ditemukan</h3>
                    <p style="color: var(--text-secondary);">Coba kata kunci lain atau pilih filter mata pelajaran yang berbeda.</p>
                </div>
            `;
        }

        return filtered.map(item => {
            const isMemorized = memorizedIds.includes(item.id);

            return `
                <div class="cheat-card ${isMemorized ? 'memorized' : ''}" id="card-${item.id}">
                    <div class="cc-header">
                        <div class="cc-badge-group">
                            <span class="badge badge-primary">${item.subject}</span>
                            <span class="badge badge-outline">${item.grade}</span>
                        </div>
                        <div class="cc-actions">
                            <button class="hafal-btn ${isMemorized ? 'active' : ''}" onclick="Rangkuman.toggleHafal('${item.id}')" title="${isMemorized ? 'Tandai belum hafal' : 'Tandai sudah hafal'}">
                                ${isMemorized ? '✓ Hafal' : 'Tandai hafal'}
                            </button>
                            <button class="copy-btn" onclick="Rangkuman.copyFormula('${item.id}')" title="Salin">
                                <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>
                            </button>
                        </div>
                    </div>

                    <h3 class="cc-title">${item.title}</h3>

                    <div class="formula-box">
                        <div class="fb-tag">Rumus inti</div>
                        <pre class="fb-content">${item.formula}</pre>
                    </div>

                    <div class="mnemonic-box">
                        <div class="mb-text"><b>Cara ingat:</b> ${item.mnemonic.replace(/^\S+\s/, m => /[A-Za-z0-9]/.test(m) ? m : '')}</div>
                    </div>

                    <div class="keys-list">
                        <div class="kl-label">Yang sering keluar</div>
                        <ul>
                            ${item.keys.map(k => `<li>${k}</li>`).join('')}
                        </ul>
                    </div>

                    ${item.example ? `
                        <div class="example-box">
                            <span class="eb-badge">Contoh:</span>
                            <span class="eb-text">${item.example}</span>
                        </div>
                    ` : ''}

                    <div class="cc-footer">
                        <button class="btn-ask-ai-mini" onclick="AITutor.askAbout('Tolong jelaskan lebih dalam tentang rumus & konsep ${item.subject}: ${item.title}')">
                            Masih bingung? Tanya tutor
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
        printCheatSheet,
        downloadCheatSheet
    };

})();

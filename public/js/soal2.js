/* Soal tambahan + pemetaan mata pelajaran → jurusan */
window.SUBJECT_TRACKS = {
    Fisika: ['ipa'], Kimia: ['ipa'], Biologi: ['ipa'],
    Matematika: ['ipa', 'ips'],
    Ekonomi: ['ips'], Sosiologi: ['ips'], Geografi: ['ips'], Sejarah: ['ips']
};

window.SOAL_SMA.push(
    // ---------- FISIKA: GLB/GLBB ----------
    { category: 'Fisika', question: 'Sebuah mobil bergerak dengan kecepatan tetap 20 m/s. Jarak yang ditempuh dalam 15 s adalah…', options: ['150 m', '300 m', '35 m', '75 m'], correct: 1,
      explanation: 'GLB: s = v·t = 20 × 15 = 300 m.' },
    { category: 'Fisika', question: 'Benda diam dipercepat 3 m/s² selama 4 s. Kecepatan akhirnya adalah…', options: ['7 m/s', '12 m/s', '0,75 m/s', '48 m/s'], correct: 1,
      explanation: 'v = v₀ + a·t = 0 + 3·4 = 12 m/s.' },
    { category: 'Fisika', question: 'Pada grafik v–t, jarak tempuh benda ditunjukkan oleh…', options: ['Kemiringan grafik', 'Luas di bawah grafik', 'Titik potong sumbu v', 'Panjang grafik'], correct: 1,
      explanation: 'Luas daerah di bawah grafik v–t = perpindahan/jarak. Kemiringan grafik v–t = percepatan.' },
    { category: 'Fisika', question: 'Batu dijatuhkan bebas dari ketinggian 20 m (g = 10 m/s²). Waktu sampai ke tanah adalah…', options: ['1 s', '2 s', '4 s', '√2 s'], correct: 1,
      explanation: 't = √(2h/g) = √(40/10) = √4 = 2 s.' },

    // ---------- MATEMATIKA: Trigonometri & Statistika ----------
    { category: 'Matematika', question: 'Pada segitiga siku-siku, sin θ sama dengan…', options: ['samping / miring', 'depan / miring', 'depan / samping', 'miring / depan'], correct: 1,
      explanation: 'SOH: Sin = Depan / Miring.' },
    { category: 'Matematika', question: 'Nilai sin 30° adalah…', options: ['½', '½√2', '½√3', '1'], correct: 0,
      explanation: 'Sudut istimewa: sin 30° = ½, sin 45° = ½√2, sin 60° = ½√3.' },
    { category: 'Matematika', question: 'Segitiga siku-siku bersisi 3, 4, 5. Nilai tan θ (θ di depan sisi 3) adalah…', options: ['3/5', '4/5', '3/4', '4/3'], correct: 2,
      explanation: 'tan θ = depan/samping = 3/4.' },
    { category: 'Matematika', question: 'Median dari data 4, 8, 6, 10, 2 adalah…', options: ['6', '8', '5', '6,0 dan 8'], correct: 0,
      explanation: 'Urutkan: 2, 4, 6, 8, 10. Nilai tengah (data ke-3) = 6.' },
    { category: 'Matematika', question: 'Mean dari data 5, 7, 8, 8, 12 adalah…', options: ['8', '7', '8,5', '9'], correct: 0,
      explanation: '(5+7+8+8+12)/5 = 40/5 = 8.' },
    { category: 'Matematika', question: 'Modus dari data 3, 5, 5, 7, 9, 5, 7 adalah…', options: ['7', '5', '3', '9'], correct: 1,
      explanation: 'Angka 5 muncul 3 kali — paling sering.' },

    // ---------- KIMIA: Mol ----------
    { category: 'Kimia', question: 'Mr dari H₂O (Ar H = 1, O = 16) adalah…', options: ['17', '18', '16', '20'], correct: 1,
      explanation: 'Mr = 2(1) + 16 = 18.' },
    { category: 'Kimia', question: 'Jumlah mol dari 36 gram air (Mr = 18) adalah…', options: ['0,5 mol', '1 mol', '2 mol', '18 mol'], correct: 2,
      explanation: 'n = massa/Mr = 36/18 = 2 mol.' },
    { category: 'Kimia', question: 'Volume 2 mol gas pada keadaan STP adalah…', options: ['22,4 L', '44,8 L', '11,2 L', '4,48 L'], correct: 1,
      explanation: 'V = n × 22,4 = 2 × 22,4 = 44,8 L.' },
    { category: 'Kimia', question: 'Bilangan Avogadro bernilai…', options: ['6,02 × 10²³', '6,02 × 10²²', '3,01 × 10²³', '22,4'], correct: 0,
      explanation: '1 mol zat mengandung 6,02 × 10²³ partikel.' },

    // ---------- BIOLOGI: Genetika ----------
    { category: 'Biologi', question: 'Persilangan Aa × Aa menghasilkan keturunan dengan rasio fenotipe (dominan penuh)…', options: ['1 : 1', '3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1'], correct: 1,
      explanation: 'Aa × Aa → AA : Aa : aa = 1 : 2 : 1, fenotipe dominan : resesif = 3 : 1.' },
    { category: 'Biologi', question: 'Genotipe yang homozigot resesif adalah…', options: ['AA', 'Aa', 'aa', 'AaBb'], correct: 2,
      explanation: 'Homozigot = alel sama; resesif = huruf kecil → aa.' },
    { category: 'Biologi', question: 'Sifat yang tampak dari luar (misal warna bunga) disebut…', options: ['Genotipe', 'Fenotipe', 'Alel', 'Kromosom'], correct: 1,
      explanation: 'Fenotipe = sifat tampak; genotipe = susunan gen.' },
    { category: 'Biologi', question: 'Rasio fenotipe persilangan dihibrid AaBb × AaBb (dominan penuh) adalah…', options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1 : 1 : 1'], correct: 2,
      explanation: 'Hukum Mendel II menghasilkan rasio fenotipe 9 : 3 : 3 : 1.' },

    // ---------- EKONOMI ----------
    { category: 'Ekonomi', question: 'Menurut hukum permintaan, jika harga suatu barang naik maka jumlah yang diminta…', options: ['Naik', 'Turun', 'Tetap', 'Tidak tentu'], correct: 1,
      explanation: 'Hukum permintaan: harga naik → jumlah yang diminta turun (ceteris paribus).' },
    { category: 'Ekonomi', question: 'Kurva penawaran biasanya berbentuk…', options: ['Miring ke kanan atas', 'Miring ke kanan bawah', 'Horizontal', 'Vertikal'], correct: 0,
      explanation: 'Harga naik → jumlah yang ditawarkan naik, sehingga kurva miring ke kanan atas.' },
    { category: 'Ekonomi', question: 'Jika Qd = 120 − P dan Qs = 2P − 30, harga keseimbangannya adalah…', options: ['40', '50', '60', '70'], correct: 1,
      explanation: '120 − P = 2P − 30 → 150 = 3P → P = 50.' },
    { category: 'Ekonomi', question: 'Harga di atas harga keseimbangan akan menyebabkan…', options: ['Kelangkaan', 'Surplus', 'Inflasi', 'Deflasi'], correct: 1,
      explanation: 'Harga lebih tinggi → Qs > Qd → terjadi surplus (kelebihan penawaran).' },
    { category: 'Ekonomi', question: 'Teh dan kopi adalah contoh barang…', options: ['Komplementer', 'Substitusi', 'Inferior', 'Public good'], correct: 1,
      explanation: 'Barang substitusi dapat saling menggantikan. Komplementer saling melengkapi (mobil–bensin).' },
    { category: 'Ekonomi', question: 'Pendapatan konsumen naik, permintaan barang normal akan…', options: ['Bergeser ke kanan', 'Bergeser ke kiri', 'Tetap', 'Menjadi vertikal'], correct: 0,
      explanation: 'Pendapatan naik → daya beli naik → seluruh kurva permintaan bergeser ke kanan (permintaan naik).' },

    // ---------- SOSIOLOGI ----------
    { category: 'Sosiologi', question: 'Syarat terjadinya interaksi sosial adalah…', options: ['Kontak sosial dan komunikasi', 'Persaingan dan konflik', 'Kerja sama dan akomodasi', 'Usia dan jenis kelamin'], correct: 0,
      explanation: 'Interaksi sosial memerlukan kontak sosial dan komunikasi.' },
    { category: 'Sosiologi', question: 'Percampuran dua budaya tanpa menghilangkan ciri khas masing-masing disebut…', options: ['Asimilasi', 'Akulturasi', 'Akomodasi', 'Kontravensi'], correct: 1,
      explanation: 'Akulturasi: budaya bercampur, ciri asli tetap tampak (contoh: Candi Borobudur).' },
    { category: 'Sosiologi', question: 'Kerja bakti membersihkan lingkungan merupakan bentuk interaksi…', options: ['Disosiatif', 'Asosiatif (kerja sama)', 'Konflik', 'Kontravensi'], correct: 1,
      explanation: 'Bekerja bersama untuk tujuan bersama = kerja sama, bentuk interaksi asosiatif.' },
    { category: 'Sosiologi', question: 'Kelompok dengan hubungan erat, personal, dan tatap muka, seperti keluarga, disebut kelompok…', options: ['Sekunder', 'Primer', 'Formal', 'Patembayan'], correct: 1,
      explanation: 'Kelompok primer: hubungan akrab dan personal. Kelompok sekunder: formal dan rasional.' },
    { category: 'Sosiologi', question: 'Ikatan lahir yang bersifat kontraktual dan berorientasi untung-rugi menurut Tönnies disebut…', options: ['Gemeinschaft', 'Gesellschaft', 'Solidaritas mekanik', 'Paguyuban'], correct: 1,
      explanation: 'Gesellschaft (patembayan) bersifat rasional dan kontraktual; Gemeinschaft (paguyuban) bersifat batin dan kekeluargaan.' },
    { category: 'Sosiologi', question: 'Sikap menyembunyikan ketidaksukaan, menyebar isu, atau menghasut termasuk…', options: ['Akomodasi', 'Kontravensi', 'Asimilasi', 'Kerja sama'], correct: 1,
      explanation: 'Kontravensi = bentuk disosiatif berupa sikap terselubung di antara persaingan dan pertentangan.' },

    // ---------- GEOGRAFI ----------
    { category: 'Geografi', question: 'Lempeng yang saling menjauh membentuk batas…', options: ['Konvergen', 'Divergen', 'Transform', 'Subduksi'], correct: 1,
      explanation: 'Batas divergen: lempeng menjauh, magma naik membentuk kerak baru.' },
    { category: 'Geografi', question: 'Tiga lempeng utama yang bertemu di wilayah Indonesia adalah…', options: ['Eurasia, Indo-Australia, Pasifik', 'Eurasia, Afrika, Pasifik', 'Amerika, Eurasia, Pasifik', 'Antartika, Indo-Australia, Afrika'], correct: 0,
      explanation: 'Indonesia dilalui pertemuan lempeng Eurasia, Indo-Australia, dan Pasifik.' },
    { category: 'Geografi', question: 'Gempa yang disebabkan oleh pergeseran lempeng disebut gempa…', options: ['Vulkanik', 'Tektonik', 'Runtuhan', 'Meteorit'], correct: 1,
      explanation: 'Gempa tektonik karena pergerakan lempeng; vulkanik karena aktivitas magma.' },
    { category: 'Geografi', question: 'Zona rawan gempa dan gunung api yang mengelilingi Samudra Pasifik disebut…', options: ['Sabuk Alpida', 'Cincin Api Pasifik', 'Palung Mariana', 'Ring of Fire Atlantik'], correct: 1,
      explanation: 'Cincin Api Pasifik (Ring of Fire) mencakup banyak gunung api dan gempa, termasuk Indonesia.' },
    { category: 'Geografi', question: 'Lapisan bumi yang berupa batuan panas dan plastis di bawah kerak adalah…', options: ['Inti luar', 'Mantel', 'Litosfer saja', 'Atmosfer'], correct: 1,
      explanation: 'Mantel bumi berada di bawah kerak; arus konveksinya menggerakkan lempeng.' },
    { category: 'Geografi', question: 'Upaya mengurangi risiko bencana gempa sebelum terjadi disebut…', options: ['Rehabilitasi', 'Mitigasi', 'Rekonstruksi', 'Tanggap darurat'], correct: 1,
      explanation: 'Mitigasi = upaya pra-bencana untuk mengurangi risiko, mis. bangunan tahan gempa.' },

    // ---------- SEJARAH ----------
    { category: 'Sejarah', question: 'Budi Utomo didirikan pada tahun…', options: ['1905', '1908', '1911', '1928'], correct: 1,
      explanation: 'Budi Utomo berdiri 20 Mei 1908 — Hari Kebangkitan Nasional.' },
    { category: 'Sejarah', question: 'Sumpah Pemuda diikrarkan pada…', options: ['28 Oktober 1928', '20 Mei 1908', '17 Agustus 1945', '1 Juni 1945'], correct: 0,
      explanation: 'Kongres Pemuda II menghasilkan Sumpah Pemuda pada 28 Oktober 1928.' },
    { category: 'Sejarah', question: 'Peristiwa Rengasdengklok terjadi karena golongan muda ingin…', options: ['Segera memproklamasikan kemerdekaan', 'Menyerang Jepang', 'Menunda proklamasi', 'Membentuk BPUPKI'], correct: 0,
      explanation: 'Golongan muda membawa Soekarno–Hatta agar tidak menunggu janji Jepang dan segera memproklamasikan kemerdekaan.' },
    { category: 'Sejarah', question: 'Naskah proklamasi diketik oleh…', options: ['Sayuti Melik', 'Moh. Yamin', 'Ahmad Soebardjo', 'Sukarni'], correct: 0,
      explanation: 'Sayuti Melik mengetik naskah proklamasi berdasarkan tulisan tangan Soekarno.' },
    { category: 'Sejarah', question: 'Badan yang mengesahkan UUD 1945 pada 18 Agustus 1945 adalah…', options: ['BPUPKI', 'PPKI', 'KNIP', 'Volksraad'], correct: 1,
      explanation: 'PPKI mengesahkan UUD 1945 dan memilih presiden serta wakil presiden pada 18 Agustus 1945.' },
    { category: 'Sejarah', question: 'Dasar negara Pancasila pertama kali dipidatokan Soekarno pada sidang BPUPKI tanggal…', options: ['1 Juni 1945', '22 Juni 1945', '17 Agustus 1945', '18 Agustus 1945'], correct: 0,
      explanation: '1 Juni 1945 Soekarno menyampaikan pidato tentang dasar negara yang dikenal sebagai lahirnya Pancasila.' }
);

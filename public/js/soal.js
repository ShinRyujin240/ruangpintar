/* Bank soal & seed forum untuk level SMA */
window.SOAL_SMA = [
    // ---------- FISIKA ----------
    { category: 'Fisika', question: 'Sebuah benda bermassa 4 kg diberi gaya 20 N. Berapa percepatannya?', options: ['2 m/s²', '5 m/s²', '8 m/s²', '80 m/s²'], correct: 1,
      explanation: 'Hukum II Newton: a = F/m = 20/4 = 5 m/s².' },
    { category: 'Fisika', question: 'Hukum I Newton juga dikenal sebagai hukum…', options: ['Aksi-Reaksi', 'Inersia', 'Gravitasi', 'Percepatan'], correct: 1,
      explanation: 'Benda cenderung mempertahankan keadaannya (diam atau GLB) bila resultan gaya nol → Hukum Inersia.' },
    { category: 'Fisika', question: 'Roket terdorong ke atas karena menyemburkan gas ke bawah. Ini contoh hukum…', options: ['Newton I', 'Newton II', 'Newton III', 'Kepler'], correct: 2,
      explanation: 'Hukum III Newton: gaya aksi (gas ke bawah) menimbulkan gaya reaksi sama besar berlawanan arah (roket ke atas).' },
    { category: 'Fisika', question: 'Berat benda bermassa 10 kg di tempat dengan g = 10 m/s² adalah…', options: ['10 N', '100 N', '1 N', '1000 N'], correct: 1,
      explanation: 'w = m·g = 10 × 10 = 100 N. Ingat: massa (kg) ≠ berat (N).' },
    { category: 'Fisika', question: 'Saat mobil direm mendadak, penumpang terdorong ke depan. Penyebabnya adalah…', options: ['Gaya gesek', 'Inersia', 'Gaya normal', 'Tekanan udara'], correct: 1,
      explanation: 'Tubuh penumpang mempertahankan geraknya (inersia) sementara mobil melambat.' },
    { category: 'Fisika', question: 'Resultan gaya pada benda 5 kg adalah 15 N. Jika awalnya diam, kecepatan setelah 4 s adalah…', options: ['3 m/s', '12 m/s', '20 m/s', '60 m/s'], correct: 1,
      explanation: 'a = 15/5 = 3 m/s². v = v₀ + a·t = 0 + 3·4 = 12 m/s.' },

    // ---------- MATEMATIKA ----------
    { category: 'Matematika', question: 'Akar-akar persamaan x² − 4x + 3 = 0 adalah…', options: ['1 dan 3', '−1 dan −3', '2 dan 3', '1 dan −3'], correct: 0,
      explanation: 'Faktorkan: (x − 1)(x − 3) = 0 → x = 1 atau x = 3.' },
    { category: 'Matematika', question: 'Jika diskriminan D < 0, maka persamaan kuadrat…', options: ['Punya dua akar real berbeda', 'Punya akar kembar', 'Tidak punya akar real', 'Punya satu akar saja'], correct: 2,
      explanation: 'D = b² − 4ac. D > 0: dua akar real; D = 0: akar kembar; D < 0: tidak ada akar real (grafik tak memotong sumbu x).' },
    { category: 'Matematika', question: 'Sumbu simetri grafik y = x² − 6x + 5 adalah x = …', options: ['3', '−3', '6', '5'], correct: 0,
      explanation: 'x = −b/(2a) = −(−6)/(2·1) = 3.' },
    { category: 'Matematika', question: 'Parabola y = ax² + bx + c terbuka ke bawah bila…', options: ['a > 0', 'a < 0', 'b > 0', 'c < 0'], correct: 1,
      explanation: 'Tanda koefisien a menentukan arah buka: a > 0 ke atas (senyum 🙂), a < 0 ke bawah (cemberut 🙁).' },
    { category: 'Matematika', question: 'Nilai diskriminan dari x² + 2x + 1 = 0 adalah…', options: ['4', '0', '−4', '2'], correct: 1,
      explanation: 'D = 2² − 4·1·1 = 4 − 4 = 0 → akar kembar (x = −1).' },
    { category: 'Matematika', question: 'Titik puncak grafik y = x² − 2x − 3 adalah…', options: ['(1, −4)', '(−1, −4)', '(1, 4)', '(2, −3)'], correct: 0,
      explanation: 'x = −b/2a = 1. y = 1 − 2 − 3 = −4. Puncak (1, −4).' },

    // ---------- KIMIA ----------
    { category: 'Kimia', question: 'Nomor atom suatu unsur menyatakan jumlah…', options: ['Neutron', 'Proton', 'Nukleon', 'Proton + neutron'], correct: 1,
      explanation: 'Nomor atom (Z) = jumlah proton = jumlah elektron pada atom netral. Nomor massa (A) = proton + neutron.' },
    { category: 'Kimia', question: 'Konfigurasi elektron Natrium (Z = 11) adalah…', options: ['2, 8, 1', '2, 8, 2', '2, 7, 2', '2, 9'], correct: 0,
      explanation: 'Kulit K maks 2, L maks 8, sisanya 1 di kulit M → 2, 8, 1. Elektron valensinya 1 (golongan IA).' },
    { category: 'Kimia', question: 'Jumlah elektron valensi Klorin (Z = 17) adalah…', options: ['1', '5', '7', '8'], correct: 2,
      explanation: 'Konfigurasi 2, 8, 7 → valensi 7 → golongan VIIA (halogen).' },
    { category: 'Kimia', question: 'Isotop adalah atom-atom yang memiliki…', options: ['Nomor atom sama, nomor massa berbeda', 'Nomor massa sama, nomor atom berbeda', 'Jumlah neutron sama', 'Jumlah elektron berbeda'], correct: 0,
      explanation: 'Isotop = unsur sama (Z sama) tetapi jumlah neutron berbeda sehingga nomor massa berbeda. Contoh: ¹²C dan ¹⁴C.' },
    { category: 'Kimia', question: 'Partikel penyusun atom yang bermuatan negatif adalah…', options: ['Proton', 'Neutron', 'Elektron', 'Nukleon'], correct: 2,
      explanation: 'Proton (+), neutron (netral), elektron (−).' },
    { category: 'Kimia', question: 'Neon (Z = 10) termasuk golongan…', options: ['Halogen', 'Gas mulia', 'Alkali', 'Alkali tanah'], correct: 1,
      explanation: 'Neon 2, 8 → kulit terluar penuh (oktet) sehingga stabil, termasuk gas mulia (VIIIA).' },

    // ---------- BIOLOGI ----------
    { category: 'Biologi', question: 'Organel yang berperan sebagai tempat respirasi sel dan penghasil ATP adalah…', options: ['Ribosom', 'Mitokondria', 'Lisosom', 'Badan Golgi'], correct: 1,
      explanation: 'Mitokondria = "pembangkit listrik sel" yang menghasilkan ATP lewat respirasi aerob.' },
    { category: 'Biologi', question: 'Perpindahan air melalui membran semipermeabel dari larutan encer ke pekat disebut…', options: ['Difusi', 'Osmosis', 'Transpor aktif', 'Endositosis'], correct: 1,
      explanation: 'Osmosis = difusi air melewati membran semipermeabel, dari konsentrasi zat terlarut rendah ke tinggi.' },
    { category: 'Biologi', question: 'Sintesis protein terjadi di…', options: ['Ribosom', 'Lisosom', 'Vakuola', 'Sentriol'], correct: 0,
      explanation: 'Ribosom menerjemahkan mRNA menjadi rantai polipeptida (protein).' },
    { category: 'Biologi', question: 'Transpor aktif berbeda dari difusi karena transpor aktif…', options: ['Membutuhkan energi (ATP)', 'Searah gradien konsentrasi', 'Tidak butuh protein', 'Hanya untuk air'], correct: 0,
      explanation: 'Transpor aktif memindahkan zat melawan gradien konsentrasi dengan bantuan protein pembawa dan energi ATP.' },
    { category: 'Biologi', question: 'Sel darah merah hewan dimasukkan ke larutan hipotonik. Yang terjadi adalah…', options: ['Mengerut (krenasi)', 'Pecah (lisis)', 'Tidak berubah', 'Membelah'], correct: 1,
      explanation: 'Larutan hipotonik lebih encer → air masuk ke sel → sel membengkak dan bisa lisis (sel hewan tak punya dinding sel).' },
    { category: 'Biologi', question: 'Organel yang mencerna sisa/sampah sel dengan enzim hidrolitik adalah…', options: ['Lisosom', 'Nukleus', 'Kloroplas', 'Retikulum endoplasma'], correct: 0,
      explanation: 'Lisosom berisi enzim pencernaan untuk menguraikan zat yang tidak dibutuhkan sel.' }
];

window.SEED_SMA = [
    { id: 'seed-1', text: 'Kak, beda massa sama berat itu apa sih? Kok di rumus Newton kadang pakai m kadang pakai w?', category: 'materi',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), upvotes: 14,
      answer: { text: 'Massa (kg) = banyaknya materi, nilainya tetap di mana pun. Berat (N) = gaya gravitasi pada benda, w = m·g, jadi berubah kalau g berubah (misal di Bulan). Di Hukum II Newton yang dipakai m untuk a = F/m.', timestamp: new Date(Date.now() - 3000000).toISOString(), isTeacher: true } },
    { id: 'seed-2', text: 'Kalau diskriminan negatif, berarti grafiknya nggak ada dong? Gimana bentuknya?', category: 'materi',
      timestamp: new Date(Date.now() - 7200000 * 3).toISOString(), upvotes: 9,
      answer: { text: 'Grafiknya tetap ada, yaitu parabola. Bedanya parabola itu tidak memotong sumbu x, jadi tidak ada akar real. Coba geser slider di materi Fungsi Kuadrat untuk melihatnya!', timestamp: new Date(Date.now() - 7200000 * 2).toISOString() } },
    { id: 'seed-3', text: 'Cara cepat nentuin elektron valensi dari nomor atom gimana ya? Suka salah di kulit ketiga.', category: 'materi',
      timestamp: new Date(Date.now() - 86400000).toISOString(), upvotes: 6, answer: null },
    { id: 'seed-4', text: 'Kapan ulangan harian Biologi bab Sel? Ada yang tau materinya sampai mana?', category: 'ujian',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), upvotes: 3, answer: null }
];

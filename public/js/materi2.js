/* ============================================================
   RuangPintar — materi2.js
   Materi tambahan: IPA (GLB, Trigonometri, Mol, Genetika, Statistika)
                    IPS (Ekonomi, Sosiologi, Geografi, Sejarah)
   ============================================================ */

const Materi2 = (() => {

    const card = (icon, title, detail) => `
        <div class="info-card" onclick="Materi.revealCard(this)">
            <span class="ic-icon">${icon}</span>
            <div class="ic-title">${title}</div>
            <div class="ic-detail">${detail}</div>
        </div>`;
    const key = (icon, text) => `<div class="key-point"><span class="kp-icon">${icon}</span><span class="kp-text">${text}</span></div>`;
    const box = html => `<div class="visual-box" style="text-align:left;font-size:14px;line-height:1.9;">${html}</div>`;
    const $ = id => document.getElementById(id);
    const r2 = n => (Math.round(n * 100) / 100).toString();

    const LESSONS = [
        // ================= IPA: FISIKA — GLB/GLBB =================
        {
            id: 'glb', tracks: ['ipa'], icon: '🏃', subject: 'Fisika', grade: 'Kelas X', color: '#6C5CE7',
            title: 'Gerak Lurus: GLB & GLBB', duration: '10 menit',
            desc: 'Pahami kecepatan, percepatan, dan jarak lewat grafik v–t yang bisa kamu atur sendiri.',
            steps: [
                {
                    title: '➡️ GLB — Kecepatan Tetap',
                    content: `
                        <p><strong>Gerak Lurus Beraturan</strong>: lintasan lurus, kecepatan konstan (a = 0).</p>
                        ${box('<b>s = v · t</b><br>s = jarak (m), v = kecepatan (m/s), t = waktu (s)')}
                        <div class="info-cards">
                            ${card('🚆', 'Contoh', 'Kereta di rel lurus dengan kecepatan 20 m/s selama 10 s menempuh 200 m.')}
                            ${card('📉', 'Grafik s–t', 'Berupa garis lurus miring; kemiringannya = kecepatan.')}
                            ${card('📊', 'Grafik v–t', 'Garis datar (horizontal); luas di bawahnya = jarak.')}
                            ${card('🔄', 'Konversi', '36 km/jam = 36 ÷ 3,6 = 10 m/s.')}
                        </div>`
                },
                {
                    title: '🎮 GLBB — Simulasi Grafik v–t',
                    content: `
                        <p><strong>Gerak Lurus Berubah Beraturan</strong>: percepatan konstan. Rumus: <b>v = v₀ + a·t</b> dan <b>s = v₀·t + ½·a·t²</b>.</p>
                        <div class="widget">
                            <svg id="gl-svg" viewBox="0 0 300 180" class="w-svg"></svg>
                            <div class="w-row"><label>Kecepatan awal v₀ = <b id="gl-v0-val">5</b> m/s</label><input type="range" id="gl-v0" min="0" max="30" value="5" oninput="Materi2.glb()"></div>
                            <div class="w-row"><label>Percepatan a = <b id="gl-a-val">2</b> m/s²</label><input type="range" id="gl-a" min="-5" max="10" value="2" oninput="Materi2.glb()"></div>
                            <div class="w-row"><label>Waktu t = <b id="gl-t-val">5</b> s</label><input type="range" id="gl-t" min="1" max="10" value="5" oninput="Materi2.glb()"></div>
                            <div class="w-result" id="gl-info"></div>
                        </div>
                        ${key('💡', 'Luas daerah di bawah grafik v–t (area berwarna) = jarak tempuh s.')}`,
                    init() { Materi2.glb(); }
                },
                {
                    title: '🍎 Jatuh Bebas & Ringkasan',
                    content: `
                        <p>Jatuh bebas adalah GLBB dengan <b>a = g ≈ 10 m/s²</b> dan v₀ = 0.</p>
                        ${box('v = g·t<br>h = ½·g·t²<br>v² = 2·g·h')}
                        ${key('📝', '<b>Contoh:</b> Batu dijatuhkan dari ketinggian 45 m. Waktu jatuh: t = √(2h/g) = √(90/10) = <b>3 s</b>; kecepatan saat tiba v = 10×3 = <b>30 m/s</b>.')}
                        ${key('🧠', 'Tanpa hambatan udara, benda berat dan ringan jatuh bersamaan!')}`
                }
            ]
        },

        // ================= IPA: MATEMATIKA — TRIGONOMETRI =================
        {
            id: 'trigonometri', tracks: ['ipa'], icon: '📐', subject: 'Matematika', grade: 'Kelas X', color: '#00B894',
            title: 'Trigonometri Dasar', duration: '10 menit',
            desc: 'Sin, cos, tan pada segitiga siku-siku — geser sudutnya dan lihat nilainya berubah.',
            steps: [
                {
                    title: '🔺 Sin, Cos, Tan (SOH-CAH-TOA)',
                    content: `
                        <p>Pada segitiga siku-siku dengan sudut θ:</p>
                        ${box('<b>sin θ = depan / miring</b> (SOH)<br><b>cos θ = samping / miring</b> (CAH)<br><b>tan θ = depan / samping</b> (TOA)')}
                        <div class="info-cards">
                            ${card('🧮', 'Pythagoras', 'miring² = depan² + samping². Triple terkenal: 3-4-5, 5-12-13.')}
                            ${card('📍', 'Contoh 3-4-5', 'θ di depan sisi 3: sin = 3/5, cos = 4/5, tan = 3/4.')}
                            ${card('🔁', 'Identitas', 'sin²θ + cos²θ = 1 selalu berlaku.')}
                            ${card('⚖️', 'Hubungan', 'tan θ = sin θ / cos θ.')}
                        </div>`
                },
                {
                    title: '🎮 Simulasi Segitiga',
                    content: `
                        <p>Geser sudut θ dan lihat bentuk segitiga serta nilai trigonometrinya.</p>
                        <div class="widget">
                            <svg id="tr-svg" viewBox="0 0 300 200" class="w-svg"></svg>
                            <div class="w-row"><label>Sudut θ = <b id="tr-th-val">30</b>°</label><input type="range" id="tr-th" min="5" max="85" value="30" oninput="Materi2.trig()"></div>
                            <div class="w-result" id="tr-info"></div>
                        </div>`,
                    init() { Materi2.trig(); }
                },
                {
                    title: '⭐ Sudut Istimewa & Contoh',
                    content: `
                        <div class="info-cards">
                            ${card('3️⃣0️⃣', '30°', 'sin = ½ • cos = ½√3 • tan = ⅓√3')}
                            ${card('4️⃣5️⃣', '45°', 'sin = ½√2 • cos = ½√2 • tan = 1')}
                            ${card('6️⃣0️⃣', '60°', 'sin = ½√3 • cos = ½ • tan = √3')}
                            ${card('9️⃣0️⃣', '0° dan 90°', 'sin 0° = 0, cos 0° = 1; sin 90° = 1, cos 90° = 0.')}
                        </div>
                        ${key('📝', '<b>Contoh:</b> Tangga 10 m disandarkan dengan sudut 60° ke tanah. Tinggi dinding yang dicapai = 10 × sin 60° = 10 × ½√3 = <b>5√3 ≈ 8,66 m</b>.')}`
                }
            ]
        },

        // ================= IPA: KIMIA — MOL =================
        {
            id: 'mol', tracks: ['ipa'], icon: '🧪', subject: 'Kimia', grade: 'Kelas X', color: '#E17055',
            title: 'Konsep Mol & Stoikiometri', duration: '10 menit',
            desc: 'Hubungkan massa, mol, jumlah partikel, dan volume gas dengan kalkulator interaktif.',
            steps: [
                {
                    title: '⚖️ Apa Itu Mol?',
                    content: `
                        <p><strong>Mol</strong> adalah satuan jumlah zat. 1 mol = <b>6,02 × 10²³</b> partikel (bilangan Avogadro, L).</p>
                        <div class="info-cards">
                            ${card('📏', 'Ar & Mr', 'Ar = massa atom relatif. Mr = jumlah Ar semua atom. Mr H₂O = 2(1) + 16 = 18.')}
                            ${card('🔢', 'Mol ↔ massa', 'n = massa (g) / Mr. 36 g air = 36/18 = 2 mol.')}
                            ${card('👥', 'Mol ↔ partikel', 'Jumlah partikel = n × 6,02×10²³.')}
                            ${card('🎈', 'Mol ↔ volume gas', 'Pada STP (0°C, 1 atm): V = n × 22,4 L.')}
                        </div>`
                },
                {
                    title: '🎮 Kalkulator Mol',
                    content: `
                        <p>Pilih zat dan atur massanya. Lihat jumlah mol, partikel, dan volume gas (STP).</p>
                        <div class="widget">
                            <div class="w-row"><label>Zat</label>
                                <select id="ml-z" class="input-field" onchange="Materi2.mol()">
                                    <option value="18|H₂O (air)">H₂O — Mr 18</option>
                                    <option value="44|CO₂">CO₂ — Mr 44</option>
                                    <option value="32|O₂">O₂ — Mr 32</option>
                                    <option value="58.5|NaCl (garam)">NaCl — Mr 58,5</option>
                                    <option value="180|C₆H₁₂O₆ (glukosa)">C₆H₁₂O₆ — Mr 180</option>
                                </select></div>
                            <div class="w-row"><label>Massa = <b id="ml-m-val">36</b> gram</label><input type="range" id="ml-m" min="1" max="300" value="36" oninput="Materi2.mol()"></div>
                            <div class="w-result" id="ml-info"></div>
                        </div>`,
                    init() { Materi2.mol(); }
                },
                {
                    title: '🎯 Ringkasan & Contoh',
                    content: `
                        ${box('n = m / Mr<br>jumlah partikel = n × 6,02×10²³<br>V<sub>STP</sub> = n × 22,4 L<br>Koefisien reaksi = perbandingan mol')}
                        ${key('📝', '<b>Contoh:</b> 2H₂ + O₂ → 2H₂O. Jika 4 mol H₂ bereaksi sempurna, H₂O terbentuk = 4 mol (perbandingan 2:2) dan O₂ yang dibutuhkan = <b>2 mol</b>.')}`
                }
            ]
        },

        // ================= IPA: BIOLOGI — GENETIKA =================
        {
            id: 'genetika', tracks: ['ipa'], icon: '🧬', subject: 'Biologi', grade: 'Kelas XII', color: '#0984E3',
            title: 'Pewarisan Sifat (Hukum Mendel)', duration: '10 menit',
            desc: 'Isi papan Punnett sendiri dan lihat rasio genotipe serta fenotipe keturunannya.',
            steps: [
                {
                    title: '🌿 Istilah Penting Genetika',
                    content: `
                        <p>Gregor Mendel meneliti kacang ercis dan menemukan pola pewarisan sifat.</p>
                        <div class="info-cards">
                            ${card('🔤', 'Gen & Alel', 'Gen = faktor penentu sifat. Alel = bentuk alternatif gen (A atau a).')}
                            ${card('🧬', 'Genotipe', 'Susunan alel, mis. AA, Aa, aa.')}
                            ${card('👀', 'Fenotipe', 'Sifat yang tampak, mis. bunga ungu atau putih.')}
                            ${card('💪', 'Dominan & Resesif', 'Alel dominan (A) menutupi resesif (a). Resesif tampak hanya jika aa.')}
                        </div>
                        ${key('💡', '<b>Homozigot</b>: alel sama (AA/aa). <b>Heterozigot</b>: alel berbeda (Aa).')}`
                },
                {
                    title: '🎮 Papan Punnett',
                    content: `
                        <p>Pilih genotipe kedua induk. Anggap A = ungu (dominan), a = putih (resesif).</p>
                        <div class="widget">
                            <div class="w-row" style="display:flex;gap:10px;">
                                <div style="flex:1"><label>Induk 1</label><select id="pn-1" class="input-field" onchange="Materi2.punnett()"><option>AA</option><option selected>Aa</option><option>aa</option></select></div>
                                <div style="flex:1"><label>Induk 2</label><select id="pn-2" class="input-field" onchange="Materi2.punnett()"><option>AA</option><option selected>Aa</option><option>aa</option></select></div>
                            </div>
                            <div id="pn-grid"></div>
                            <div class="w-result" id="pn-info"></div>
                        </div>`,
                    init() { Materi2.punnett(); }
                },
                {
                    title: '📜 Hukum Mendel I & II',
                    content: `
                        <div class="info-cards">
                            ${card('1️⃣', 'Mendel I — Segregasi', 'Saat pembentukan gamet, pasangan alel memisah. Persilangan monohibrid Aa × Aa → rasio fenotipe 3 : 1.')}
                            ${card('2️⃣', 'Mendel II — Berpasangan bebas', 'Alel dari gen berbeda memisah bebas. Dihibrid AaBb × AaBb → rasio fenotipe 9 : 3 : 3 : 1.')}
                            ${card('🌸', 'Dominansi tidak penuh', 'Merah × putih → merah muda (Mirabilis jalapa); rasio 1 : 2 : 1.')}
                            ${card('🔬', 'Uji silang', 'Individu dominan × resesif (aa) untuk mengetahui apakah individu itu homozigot atau heterozigot.')}
                        </div>
                        ${key('📝', '<b>Contoh:</b> Aa × Aa menghasilkan 160 keturunan. Ungu ≈ ¾ × 160 = <b>120</b>, putih ≈ ¼ × 160 = <b>40</b>.')}`
                }
            ]
        },

        // ================= SEMUA JURUSAN: STATISTIKA =================
        {
            id: 'statistika', tracks: ['ipa', 'ips'], icon: '📊', subject: 'Matematika', grade: 'Kelas XII', color: '#fdcb6e',
            title: 'Statistika: Mean, Median, Modus', duration: '8 menit',
            desc: 'Masukkan datamu sendiri dan hitung ukuran pemusatan serta penyebaran data.',
            steps: [
                {
                    title: '📏 Ukuran Pemusatan Data',
                    content: `
                        <div class="info-cards">
                            ${card('➗', 'Mean (rata-rata)', 'Jumlah semua data ÷ banyak data. Mudah dipengaruhi nilai ekstrem.')}
                            ${card('🎯', 'Median', 'Nilai tengah setelah data diurutkan. Tahan terhadap nilai ekstrem.')}
                            ${card('🏆', 'Modus', 'Nilai yang paling sering muncul. Bisa lebih dari satu, atau tidak ada.')}
                            ${card('↔️', 'Jangkauan', 'Data terbesar − data terkecil: ukuran penyebaran paling sederhana.')}
                        </div>
                        ${key('💡', 'Data genap: median = rata-rata dua data tengah.')}`
                },
                {
                    title: '🎮 Hitung Datamu',
                    content: `
                        <p>Ketik data (pisahkan dengan koma), misalnya nilai ulangan. Hasil dihitung otomatis.</p>
                        <div class="widget">
                            <div class="w-row"><label>Data</label><input id="st-in" class="input-field" value="70, 85, 90, 85, 60, 75, 100" oninput="Materi2.stat()"></div>
                            <div class="w-result" id="st-info"></div>
                        </div>
                        ${key('🧠', 'Coba tambahkan angka ekstrem seperti 5 atau 1000 — lihat mana yang lebih berubah: mean atau median?')}`,
                    init() { Materi2.stat(); }
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        ${box('Mean = Σx / n<br>Median = nilai tengah (data terurut)<br>Modus = paling sering muncul<br>Jangkauan = x<sub>maks</sub> − x<sub>min</sub>')}
                        ${key('📝', '<b>Contoh:</b> Data 4, 6, 6, 8, 11. Mean = 35/5 = <b>7</b>, median = <b>6</b>, modus = <b>6</b>, jangkauan = 11 − 4 = <b>7</b>.')}`
                }
            ]
        },

        // ================= IPS: EKONOMI =================
        {
            id: 'permintaan', tracks: ['ips'], icon: '💹', subject: 'Ekonomi', grade: 'Kelas X', color: '#6C5CE7',
            title: 'Permintaan, Penawaran & Harga Keseimbangan', duration: '12 menit',
            desc: 'Geser harga dan lihat surplus, kelangkaan, serta titik keseimbangan pasar secara grafis.',
            steps: [
                {
                    title: '🛒 Hukum Permintaan',
                    content: `
                        <p>"Jika harga naik, jumlah barang yang diminta turun (ceteris paribus)." Kurva permintaan <b>miring ke kanan bawah</b>.</p>
                        <p style="font-size:13px;">Faktor yang <b>menggeser</b> kurva permintaan:</p>
                        <div class="info-cards">
                            ${card('💰', 'Pendapatan', 'Pendapatan naik → permintaan barang normal naik.')}
                            ${card('🔀', 'Harga barang lain', 'Barang substitusi (teh–kopi) dan komplementer (mobil–bensin) memengaruhi permintaan.')}
                            ${card('❤️', 'Selera', 'Tren dan preferensi konsumen mengubah permintaan.')}
                            ${card('👥', 'Jumlah penduduk', 'Penduduk bertambah → permintaan naik.')}
                        </div>`
                },
                {
                    title: '🏭 Hukum Penawaran',
                    content: `
                        <p>"Jika harga naik, jumlah barang yang ditawarkan naik." Kurva penawaran <b>miring ke kanan atas</b>.</p>
                        <div class="info-cards">
                            ${card('⚙️', 'Biaya produksi', 'Biaya bahan baku naik → penawaran turun.')}
                            ${card('🔧', 'Teknologi', 'Teknologi lebih canggih → produksi efisien → penawaran naik.')}
                            ${card('📜', 'Pajak & subsidi', 'Pajak menurunkan penawaran, subsidi menaikkannya.')}
                            ${card('🎯', 'Ekspektasi', 'Produsen menahan barang bila memperkirakan harga naik.')}
                        </div>
                        ${key('⚠️', 'Beda "perubahan jumlah" dan "perubahan permintaan/penawaran": harga berubah → bergerak sepanjang kurva; faktor lain berubah → kurva bergeser.')}`
                },
                {
                    title: '🎮 Simulasi Pasar',
                    content: `
                        <p>Fungsi: <b>Qd = 120 − P</b> dan <b>Qs = 2P − 30</b> (P dalam ribu rupiah). Geser harga!</p>
                        <div class="widget">
                            <svg id="sd-svg" viewBox="0 0 300 220" class="w-svg"></svg>
                            <div class="w-row"><label>Harga P = Rp<b id="sd-p-val">50</b> ribu</label><input type="range" id="sd-p" min="15" max="110" value="80" oninput="Materi2.market()"></div>
                            <div class="w-result" id="sd-info"></div>
                        </div>
                        ${key('💡', 'Keseimbangan: Qd = Qs → 120 − P = 2P − 30 → P = 50, Q = 70.')}`,
                    init() { Materi2.market(); }
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        ${box('Harga ↑ → Qd ↓ (hukum permintaan)<br>Harga ↑ → Qs ↑ (hukum penawaran)<br>Harga keseimbangan: Qd = Qs<br>P &gt; P* → surplus (kelebihan penawaran)<br>P &lt; P* → shortage (kelebihan permintaan)')}
                        ${key('📝', '<b>Contoh:</b> Qd = 100 − 2P, Qs = −20 + 4P. Keseimbangan: 100 − 2P = −20 + 4P → 6P = 120 → <b>P = 20, Q = 60</b>.')}`
                }
            ]
        },

        // ================= IPS: SOSIOLOGI =================
        {
            id: 'sosiologi', tracks: ['ips'], icon: '🤝', subject: 'Sosiologi', grade: 'Kelas X', color: '#00B894',
            title: 'Interaksi Sosial & Kelompok Sosial', duration: '10 menit',
            desc: 'Kenali bentuk interaksi asosiatif dan disosiatif, lalu uji lewat skenario kehidupan sehari-hari.',
            steps: [
                {
                    title: '💬 Syarat & Bentuk Interaksi Sosial',
                    content: `
                        <p>Interaksi sosial terjadi jika ada <b>kontak sosial</b> dan <b>komunikasi</b>.</p>
                        <p style="font-size:13px;"><b>Asosiatif</b> (menyatukan):</p>
                        <div class="info-cards">
                            ${card('🤝', 'Kerja sama', 'Bekerja bersama mencapai tujuan bersama, mis. gotong royong.')}
                            ${card('🕊️', 'Akomodasi', 'Penyelesaian pertentangan tanpa menghancurkan pihak lawan, mis. mediasi.')}
                            ${card('🧩', 'Asimilasi', 'Peleburan budaya sehingga identitas asli hilang, membentuk budaya baru.')}
                            ${card('🎨', 'Akulturasi', 'Percampuran budaya tanpa menghilangkan ciri asli, mis. Candi Borobudur.')}
                        </div>
                        <p style="font-size:13px;"><b>Disosiatif</b> (memisahkan): persaingan, kontravensi (sikap terselubung), dan pertentangan/konflik.</p>`
                },
                {
                    title: '🎮 Tebak Bentuk Interaksi',
                    content: `
                        <p>Pilih bentuk interaksi yang paling tepat untuk tiap skenario!</p>
                        <div class="widget" id="sc-box"></div>`,
                    init() { Materi2.scenario(0); }
                },
                {
                    title: '👪 Kelompok Sosial',
                    content: `
                        <div class="info-cards">
                            ${card('🏠', 'Kelompok primer', 'Hubungan erat, personal, tatap muka: keluarga, sahabat.')}
                            ${card('🏢', 'Kelompok sekunder', 'Hubungan formal, rasional, tujuan tertentu: organisasi, perusahaan.')}
                            ${card('❤️', 'Paguyuban (Gemeinschaft)', 'Ikatan batin alami dan kekeluargaan (Ferdinand Tönnies).')}
                            ${card('📃', 'Patembayan (Gesellschaft)', 'Ikatan lahir, kontraktual, berorientasi untung-rugi.')}
                        </div>
                        ${key('📝', '<b>Contoh:</b> Karang taruna di desa = paguyuban; serikat pekerja pabrik = patembayan.')}`
                }
            ]
        },

        // ================= IPS: GEOGRAFI =================
        {
            id: 'litosfer', tracks: ['ips'], icon: '🌋', subject: 'Geografi', grade: 'Kelas XI', color: '#E17055',
            title: 'Dinamika Litosfer: Lempeng, Gempa & Gunung Api', duration: '10 menit',
            desc: 'Mengapa Indonesia rawan gempa? Eksplor tiga jenis batas lempeng dan mitigasi bencananya.',
            steps: [
                {
                    title: '🌍 Struktur Bumi & Lempeng',
                    content: `
                        <p>Litosfer (kerak + bagian atas mantel) terpecah menjadi <b>lempeng tektonik</b> yang bergerak di atas astenosfer.</p>
                        <div class="info-cards">
                            ${card('🧱', 'Kerak bumi', 'Lapisan terluar; benua (granitis) dan samudra (basaltis).')}
                            ${card('🔥', 'Mantel', 'Lapisan tengah, batuan panas dan plastis; arus konveksi menggerakkan lempeng.')}
                            ${card('🧲', 'Inti bumi', 'Inti luar cair, inti dalam padat (besi dan nikel).')}
                            ${card('🗺️', 'Teori tektonik', 'Lempeng bergerak beberapa cm per tahun akibat arus konveksi mantel.')}
                        </div>`
                },
                {
                    title: '🎮 Tiga Batas Lempeng',
                    content: `
                        <p>Klik jenis batas lempeng untuk melihat gerakan, akibat, dan contohnya.</p>
                        <div class="widget">
                            <div class="chip-group" style="justify-content:center;">
                                <span class="chip active" id="lp-b0" onclick="Materi2.plate(0)">Divergen</span>
                                <span class="chip" id="lp-b1" onclick="Materi2.plate(1)">Konvergen</span>
                                <span class="chip" id="lp-b2" onclick="Materi2.plate(2)">Transform</span>
                            </div>
                            <div id="lp-view"></div>
                        </div>`,
                    init() { Materi2.plate(0); }
                },
                {
                    title: '🇮🇩 Indonesia & Mitigasi',
                    content: `
                        <p>Indonesia berada di pertemuan <b>3 lempeng</b>: Eurasia, Indo-Australia, dan Pasifik — serta dilalui <b>Cincin Api Pasifik</b>.</p>
                        <div class="info-cards">
                            ${card('🌋', 'Gunung api', 'Terbentuk di zona subduksi; Indonesia memiliki ±127 gunung api aktif.')}
                            ${card('📳', 'Gempa tektonik', 'Akibat pergeseran lempeng; paling sering dan paling merusak.')}
                            ${card('🌊', 'Tsunami', 'Gelombang laut akibat gempa dasar laut, letusan, atau longsor bawah laut.')}
                            ${card('🛡️', 'Mitigasi', 'Struktur tahan gempa, jalur evakuasi, peta rawan bencana, dan latihan simulasi.')}
                        </div>
                        ${key('📝', 'Gempa tektonik ≠ vulkanik: tektonik karena lempeng bergeser; vulkanik karena aktivitas magma gunung api.')}`
                }
            ]
        },

        // ================= IPS: SEJARAH =================
        {
            id: 'kemerdekaan', tracks: ['ips'], icon: '🇮🇩', subject: 'Sejarah', grade: 'Kelas XI', color: '#d63031',
            title: 'Menuju Kemerdekaan Indonesia', duration: '12 menit',
            desc: 'Jelajahi linimasa interaktif dari Budi Utomo (1908) hingga Proklamasi dan UUD 1945.',
            steps: [
                {
                    title: '🌱 Pergerakan Nasional',
                    content: `
                        <p>Awal abad ke-20 muncul kesadaran <b>nasional</b> melalui organisasi modern.</p>
                        <div class="info-cards">
                            ${card('🎓', 'Budi Utomo (1908)', 'Dipelopori dr. Wahidin & dr. Soetomo; tonggak Kebangkitan Nasional (20 Mei).')}
                            ${card('🕌', 'Sarekat Islam (1911)', 'Awalnya Sarekat Dagang Islam; dipimpin H.O.S. Tjokroaminoto, berbasis massa.')}
                            ${card('⚔️', 'Indische Partij (1912)', 'Dipimpin Tiga Serangkai; menuntut Indonesia merdeka.')}
                            ${card('🔴', 'PNI (1927)', 'Dipimpin Soekarno; berhaluan nasionalis dan non-kooperasi.')}
                        </div>
                        ${key('📣', '<b>Sumpah Pemuda 1928</b>: satu nusa, satu bangsa, satu bahasa persatuan — Indonesia.')}`
                },
                {
                    title: '🗓️ Linimasa Menuju Proklamasi',
                    content: `
                        <p>Geser untuk menelusuri peristiwa-peristiwa penting secara berurutan.</p>
                        <div class="widget">
                            <div id="tl-view"></div>
                            <div class="w-row" style="margin-top:12px;"><input type="range" id="tl-i" min="0" max="7" value="0" oninput="Materi2.timeline()"></div>
                        </div>`,
                    init() { Materi2.timeline(); }
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        ${box('1908 Budi Utomo → 1928 Sumpah Pemuda<br>1942 Jepang menduduki Indonesia<br>1945: BPUPKI → PPKI<br>16 Agu: Rengasdengklok<br><b>17 Agu 1945: Proklamasi</b> (Soekarno–Hatta)<br>18 Agu 1945: UUD 1945, presiden &amp; wakil presiden')}
                        ${key('💡', 'Teks proklamasi diketik oleh Sayuti Melik; bendera Merah Putih dijahit Ibu Fatmawati.')}`
                }
            ]
        }
    ];

    // ---------- WIDGETS ----------
    function glb() {
        const v0 = +($('gl-v0')?.value ?? 5), a = +($('gl-a')?.value ?? 2), t = +($('gl-t')?.value ?? 5);
        if ($('gl-v0-val')) $('gl-v0-val').textContent = v0;
        if ($('gl-a-val')) $('gl-a-val').textContent = a;
        if ($('gl-t-val')) $('gl-t-val').textContent = t;
        const v = v0 + a * t, s = v0 * t + 0.5 * a * t * t;
        const W = 300, H = 180, pl = 30, pb = 20, vmax = 30 + 10 * 10, vmin = -20;
        const X = x => pl + (x / 10) * (W - pl - 10);
        const Y = y => (H - pb) - ((y - vmin) / (vmax - vmin)) * (H - pb - 10);
        const yAt = x => v0 + a * x;
        const zero = Y(0);
        const svg = document.getElementById('gl-svg');
        if (svg) svg.innerHTML = `
            <line x1="${pl}" y1="${zero}" x2="${W - 5}" y2="${zero}" stroke="var(--text-muted)"/>
            <line x1="${pl}" y1="5" x2="${pl}" y2="${H - pb}" stroke="var(--text-muted)"/>
            <polygon points="${X(0)},${zero} ${X(0)},${Y(yAt(0))} ${X(t)},${Y(yAt(t))} ${X(t)},${zero}" fill="rgba(108,92,231,.25)"/>
            <line x1="${X(0)}" y1="${Y(yAt(0))}" x2="${X(10)}" y2="${Y(yAt(10))}" stroke="#6C5CE7" stroke-width="3" stroke-dasharray="5 4" opacity=".35"/>
            <line x1="${X(0)}" y1="${Y(yAt(0))}" x2="${X(t)}" y2="${Y(yAt(t))}" stroke="#6C5CE7" stroke-width="3"/>
            <circle cx="${X(t)}" cy="${Y(yAt(t))}" r="5" fill="#FDCB6E" stroke="#333"/>
            <text x="${W - 40}" y="${H - 6}" font-size="10" fill="var(--text-secondary)">t (s)</text>
            <text x="4" y="14" font-size="10" fill="var(--text-secondary)">v</text>`;
        const jenis = a === 0 ? '➡️ GLB (a = 0)' : a > 0 ? '⚡ GLBB dipercepat' : '🛑 GLBB diperlambat';
        if ($('gl-info')) $('gl-info').innerHTML = `${jenis}<br>v = ${v0} + (${a})(${t}) = <b>${r2(v)} m/s</b><br>s = ${v0}·${t} + ½·${a}·${t}² = <b>${r2(s)} m</b>${v < 0 ? '<br>⚠️ v negatif: benda sudah berbalik arah.' : ''}`;
    }

    function trig() {
        const th = +($('tr-th')?.value || 30);
        if ($('tr-th-val')) $('tr-th-val').textContent = th;
        const rad = th * Math.PI / 180, L = 150;
        const x0 = 40, y0 = 170, x1 = x0 + L * Math.cos(rad), y1 = y0 - L * Math.sin(rad);
        const svg = document.getElementById('tr-svg');
        if (svg) svg.innerHTML = `
            <polygon points="${x0},${y0} ${x1},${y0} ${x1},${y1}" fill="rgba(0,184,148,.18)" stroke="#00B894" stroke-width="2.5"/>
            <rect x="${x1 - 10}" y="${y0 - 10}" width="10" height="10" fill="none" stroke="#00B894"/>
            <path d="M ${x0 + 28} ${y0} A 28 28 0 0 0 ${x0 + 28 * Math.cos(rad)} ${y0 - 28 * Math.sin(rad)}" fill="none" stroke="#E17055" stroke-width="2"/>
            <text x="${x0 + 34}" y="${y0 - 6}" font-size="12" fill="#E17055" font-weight="700">θ</text>
            <text x="${(x0 + x1) / 2 - 18}" y="${y0 + 14}" font-size="11" fill="var(--text-secondary)">samping</text>
            <text x="${x1 + 4}" y="${(y0 + y1) / 2}" font-size="11" fill="var(--text-secondary)">depan</text>
            <text x="${(x0 + x1) / 2 - 24}" y="${(y0 + y1) / 2 - 8}" font-size="11" fill="var(--text-secondary)">miring</text>`;
        const s = Math.sin(rad), c = Math.cos(rad);
        if ($('tr-info')) $('tr-info').innerHTML = `sin ${th}° = <b>${s.toFixed(3)}</b> • cos ${th}° = <b>${c.toFixed(3)}</b> • tan ${th}° = <b>${(s / c).toFixed(3)}</b><br>sin² + cos² = ${(s * s + c * c).toFixed(3)} ✔️`;
    }

    function mol() {
        const val = $('ml-z')?.value || '18|H₂O (air)';
        const [mr, name] = val.split('|');
        const m = +($('ml-m')?.value || 36), Mr = +(mr || 18);
        if ($('ml-m-val')) $('ml-m-val').textContent = m;
        const n = m / Mr, p = n * 6.02e23, gas = ['O₂', 'CO₂'].some(g => (name || '').startsWith(g));
        const sci = x => { const e = Math.floor(Math.log10(x)); return (x / Math.pow(10, e)).toFixed(2) + ' × 10<sup>' + e + '</sup>'; };
        if ($('ml-info')) $('ml-info').innerHTML = `${name}: n = ${m} / ${Mr} = <b>${n.toFixed(3)} mol</b><br>Partikel ≈ <b>${sci(p)}</b><br>${gas ? 'Volume gas (STP) = <b>' + (n * 22.4).toFixed(2) + ' L</b>' : '<span style="color:var(--text-muted)">Bukan gas pada STP — rumus 22,4 L/mol tidak berlaku.</span>'}`;
    }

    function punnett() {
        const p1 = $('pn-1')?.value || 'Aa', p2 = $('pn-2')?.value || 'Aa';
        const g1 = [p1[0] || 'A', p1[1] || 'a'], g2 = [p2[0] || 'A', p2[1] || 'a'];
        const cell = (a, b) => [a, b].sort((x, y) => (x === 'A' ? -1 : 1)).join('');
        const res = [];
        let html = '<table style="margin:10px auto;border-collapse:collapse;text-align:center;"><tr><td></td>';
        g2.forEach(g => html += `<td style="padding:6px 14px;font-weight:800;color:#6C5CE7">${g}</td>`);
        html += '</tr>';
        g1.forEach(a => {
            html += `<tr><td style="padding:6px 14px;font-weight:800;color:#E17055">${a}</td>`;
            g2.forEach(b => { const gt = cell(a, b); res.push(gt); html += `<td style="padding:12px 18px;border:2px solid var(--primary-light);background:var(--bg-card);font-weight:800;border-radius:8px">${gt}</td>`; });
            html += '</tr>';
        });
        html += '</table>';
        if ($('pn-grid')) $('pn-grid').innerHTML = html;
        const cnt = {}; res.forEach(g => cnt[g] = (cnt[g] || 0) + 1);
        const ungu = res.filter(g => g.includes('A')).length;
        if ($('pn-info')) $('pn-info').innerHTML = `Genotipe: ${Object.entries(cnt).map(([g, n]) => `<b>${g}</b> ${n}/4`).join(' • ')}<br>Fenotipe: 🟣 ungu <b>${ungu}/4</b> • ⚪ putih <b>${4 - ungu}/4</b>`;
    }

    function stat() {
        const nums = $('st-in').value.split(/[,;\s]+/).filter(t => t !== '').map(Number).filter(n => !isNaN(n));
        const el = $('st-info');
        if (!nums.length) { el.textContent = 'Masukkan minimal satu angka.'; return; }
        const s = [...nums].sort((a, b) => a - b), n = s.length;
        const mean = s.reduce((a, b) => a + b, 0) / n;
        const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
        const f = {}; s.forEach(x => f[x] = (f[x] || 0) + 1);
        const mx = Math.max(...Object.values(f));
        const modus = mx === 1 ? 'tidak ada' : Object.keys(f).filter(k => f[k] === mx).join(', ');
        el.innerHTML = `Data terurut: ${s.join(', ')}<br>n = <b>${n}</b> • Mean = <b>${r2(mean)}</b> • Median = <b>${r2(med)}</b><br>Modus = <b>${modus}</b> • Jangkauan = <b>${r2(s[n - 1] - s[0])}</b>`;
    }

    function market() {
        const P = +$('sd-p').value;
        $('sd-p-val').textContent = P;
        const Qd = Math.max(0, 120 - P), Qs = Math.max(0, 2 * P - 30);
        const W = 300, H = 220, pl = 30, pb = 22;
        const X = q => pl + (q / 120) * (W - pl - 10), Y = p => (H - pb) - (p / 120) * (H - pb - 10);
        document.getElementById('sd-svg').innerHTML = `
            <line x1="${pl}" y1="${H - pb}" x2="${W - 5}" y2="${H - pb}" stroke="var(--text-muted)"/>
            <line x1="${pl}" y1="5" x2="${pl}" y2="${H - pb}" stroke="var(--text-muted)"/>
            <line x1="${X(120)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(120)}" stroke="#E17055" stroke-width="3"/>
            <line x1="${X(0)}" y1="${Y(15)}" x2="${X(120)}" y2="${Y(75)}" stroke="#00B894" stroke-width="3"/>
            <line x1="${pl}" y1="${Y(P)}" x2="${W - 8}" y2="${Y(P)}" stroke="#6C5CE7" stroke-dasharray="5 4"/>
            <circle cx="${X(70)}" cy="${Y(50)}" r="6" fill="#FDCB6E" stroke="#333"/>
            <circle cx="${X(Qd)}" cy="${Y(P)}" r="4" fill="#E17055"/><circle cx="${X(Qs)}" cy="${Y(P)}" r="4" fill="#00B894"/>
            <text x="${W - 55}" y="${Y(8)}" font-size="11" fill="#E17055" font-weight="700">Demand</text>
            <text x="${X(88)}" y="${Y(100)}" font-size="11" fill="#00B894" font-weight="700">Supply</text>
            <text x="${pl + 4}" y="12" font-size="10" fill="var(--text-secondary)">P</text>
            <text x="${W - 22}" y="${H - 8}" font-size="10" fill="var(--text-secondary)">Q</text>`;
        let status;
        if (P === 50) status = '⚖️ <b>Keseimbangan pasar!</b>';
        else if (P > 50) status = `📦 <b>Surplus</b> (penawaran berlebih) sebesar ${Qs - Qd} unit → harga cenderung turun`;
        else status = `🔥 <b>Kelangkaan (shortage)</b> sebesar ${Qd - Qs} unit → harga cenderung naik`;
        $('sd-info').innerHTML = `Qd = ${Qd} • Qs = ${Qs}<br>${status}<br><span style="font-weight:400;font-size:12px;">Titik 🟡 = keseimbangan (P = 50, Q = 70)</span>`;
    }

    const SCEN = [
        { q: '🏘️ Warga satu RT bahu-membahu membersihkan selokan agar tidak banjir.', o: ['Kerja sama', 'Persaingan', 'Pertentangan'], a: 0, e: 'Bekerja bersama untuk tujuan bersama = kerja sama (asosiatif).' },
        { q: '🏆 Dua sekolah berlomba menjadi juara olimpiade sains dengan cara sehat.', o: ['Akomodasi', 'Persaingan', 'Asimilasi'], a: 1, e: 'Berlomba mencapai tujuan yang sama = persaingan (disosiatif).' },
        { q: '🏛️ Arsitektur masjid bergaya atap tumpang khas Hindu-Jawa, tetapi fungsi ibadahnya tetap Islam.', o: ['Akulturasi', 'Asimilasi', 'Kontravensi'], a: 0, e: 'Dua budaya bercampur tanpa menghilangkan ciri asli = akulturasi.' },
        { q: '⚖️ Dua kubu bertikai, lalu mediator mempertemukan dan menyepakati damai.', o: ['Kerja sama', 'Akomodasi', 'Persaingan'], a: 1, e: 'Penyelesaian pertentangan tanpa menghancurkan lawan = akomodasi.' }
    ];
    function scenario(i) {
        const box = $('sc-box'); if (!box) return;
        if (i >= SCEN.length) { box.innerHTML = '<div class="w-result">🎉 Semua skenario selesai! Kamu paham bentuk interaksi sosial.</div><button class="btn btn-sm btn-outline btn-full" style="margin-top:10px;" onclick="Materi2.scenario(0)">🔄 Ulangi</button>'; return; }
        const s = SCEN[i];
        box.innerHTML = `<p style="font-weight:700;">${i + 1}/${SCEN.length} — ${s.q}</p>
            <div class="quiz-options" style="margin-top:10px;">${s.o.map((o, k) => `<button class="quiz-option" onclick="Materi2.scAnswer(${i},${k},this)"><span class="qo-letter">${'ABC'[k]}</span><span class="qo-text">${o}</span></button>`).join('')}</div>
            <div id="sc-fb" class="w-hint"></div>`;
    }
    function scAnswer(i, k, el) {
        const s = SCEN[i], ok = k === s.a;
        document.querySelectorAll('#sc-box .quiz-option').forEach((b, idx) => { b.classList.add('disabled'); if (idx === s.a) b.classList.add('correct'); });
        if (!ok) el.classList.add('wrong');
        $('sc-fb').innerHTML = `${ok ? '✅ Benar!' : '❌ Belum tepat.'} ${s.e}<br><button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="Materi2.scenario(${i + 1})">Lanjut →</button>`;
    }

    const PLATES = [
        { t: 'Divergen', arrows: '⬅️ 🌋 ➡️', d: 'Dua lempeng saling menjauh. Magma naik membentuk kerak baru.', e: 'Punggung tengah samudra (Mid-Atlantic Ridge), Great Rift Valley Afrika.' },
        { t: 'Konvergen', arrows: '➡️ 💥 ⬅️', d: 'Dua lempeng saling menumbuk. Lempeng samudra menunjam (subduksi) di bawah lempeng lain → palung laut, gunung api, gempa kuat.', e: 'Palung Jawa & Sumatra, Pegunungan Himalaya, Andes.' },
        { t: 'Transform', arrows: '⬆️ ↔️ ⬇️', d: 'Dua lempeng bergeser saling berpapasan secara mendatar. Tidak ada kerak dibentuk atau dihancurkan, tetapi sering memicu gempa.', e: 'Sesar San Andreas (Amerika Serikat), Sesar Palu-Koro (Sulawesi).' }
    ];
    function plate(i) {
        const p = PLATES[i];
        [0, 1, 2].forEach(k => { const c = $('lp-b' + k); if (c) c.classList.toggle('active', k === i); });
        $('lp-view').innerHTML = `<div style="text-align:center;font-size:36px;margin:12px 0;">${p.arrows}</div>
            <div class="w-result" style="text-align:left;"><b>Batas ${p.t}</b><br><span style="font-weight:400;font-size:13px;">${p.d}</span><br><span style="font-size:13px;">📍 Contoh: ${p.e}</span></div>`;
    }

    const TL = [
        { y: '1908', t: 'Berdirinya Budi Utomo', d: 'Organisasi modern pertama; 20 Mei diperingati sebagai Hari Kebangkitan Nasional.' },
        { y: '1928', t: 'Sumpah Pemuda', d: 'Kongres Pemuda II (28 Oktober) mengikrarkan satu tanah air, bangsa, dan bahasa.' },
        { y: '1942', t: 'Jepang Menduduki Indonesia', d: 'Belanda menyerah di Kalijati (8 Maret). Dimulainya pendudukan Jepang selama ±3,5 tahun.' },
        { y: 'Mar–Jul 1945', t: 'BPUPKI & Dasar Negara', d: 'Sidang BPUPKI membahas dasar negara; lahirnya Pancasila (1 Juni) dan Piagam Jakarta (22 Juni).' },
        { y: 'Agu 1945 (6–9)', t: 'Bom Atom Hiroshima & Nagasaki', d: 'Jepang menyerah kepada Sekutu (15 Agustus) sehingga terjadi kekosongan kekuasaan di Indonesia.' },
        { y: '16 Agu 1945', t: 'Peristiwa Rengasdengklok', d: 'Golongan muda membawa Soekarno–Hatta ke Rengasdengklok agar segera memproklamasikan kemerdekaan.' },
        { y: '17 Agu 1945', t: 'Proklamasi Kemerdekaan', d: 'Soekarno–Hatta membacakan proklamasi di Jl. Pegangsaan Timur 56, Jakarta pukul 10.00.' },
        { y: '18 Agu 1945', t: 'Sidang PPKI', d: 'Pengesahan UUD 1945, Soekarno–Hatta menjadi presiden dan wakil presiden pertama.' }
    ];
    function timeline() {
        const i = +$('tl-i').value, e = TL[i];
        $('tl-view').innerHTML = `<div class="card" style="text-align:left;border-left:5px solid #d63031;">
            <span class="badge badge-error">${e.y}</span>
            <h3 style="margin:8px 0 6px;font-size:16px;">${e.t}</h3>
            <p style="font-size:13.5px;color:var(--text-secondary);margin:0;">${e.d}</p></div>
            <div style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:6px;">Peristiwa ${i + 1} dari ${TL.length}</div>`;
    }

    Materi.register(LESSONS);

    return { glb, trig, mol, punnett, stat, market, scenario, scAnswer, plate, timeline };
})();

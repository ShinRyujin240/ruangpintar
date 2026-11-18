/* ============================================================
   RuangPintar — materi.js (level SMA)
   Materi interaktif: Fisika, Matematika, Kimia, Biologi
   ============================================================ */

const Materi = (() => {

    const card = (icon, title, detail) => `
        <div class="info-card" onclick="Materi.revealCard(this)">
            <span class="ic-icon">${icon}</span>
            <div class="ic-title">${title}</div>
            <div class="ic-detail">${detail}</div>
        </div>`;
    const key = (icon, text) => `<div class="key-point"><span class="kp-icon">${icon}</span><span class="kp-text">${text}</span></div>`;

    const ELEMENTS = [
        ['H', 'Hidrogen', 1], ['He', 'Helium', 4], ['Li', 'Litium', 7], ['Be', 'Berilium', 9], ['B', 'Boron', 11],
        ['C', 'Karbon', 12], ['N', 'Nitrogen', 14], ['O', 'Oksigen', 16], ['F', 'Fluor', 19], ['Ne', 'Neon', 20],
        ['Na', 'Natrium', 23], ['Mg', 'Magnesium', 24], ['Al', 'Aluminium', 27], ['Si', 'Silikon', 28], ['P', 'Fosfor', 31],
        ['S', 'Belerang', 32], ['Cl', 'Klorin', 35], ['Ar', 'Argon', 40], ['K', 'Kalium', 39], ['Ca', 'Kalsium', 40]
    ];

    const LESSONS = [
        // ================= FISIKA =================
        {
            id: 'newton', icon: '🚀', subject: 'Fisika', grade: 'Kelas X', color: '#6C5CE7',
            title: 'Hukum Newton tentang Gerak',
            desc: 'Dari inersia sampai roket: pahami tiga hukum Newton dan mainkan simulasi F = m·a.',
            duration: '12 menit',
            steps: [
                {
                    title: '🍎 Hukum I Newton — Inersia',
                    content: `
                        <p>"Setiap benda tetap diam atau bergerak lurus beraturan <strong>selama resultan gaya = 0</strong>."</p>
                        <p style="font-size:13px;">Rumus: <strong>ΣF = 0 → a = 0</strong>. Klik kartu untuk melihat contoh sehari-hari:</p>
                        <div class="info-cards">
                            ${card('🚌', 'Bus mengerem', 'Penumpang terdorong ke depan karena tubuhnya mempertahankan gerak (inersia).')}
                            ${card('🃏', 'Tarik taplak meja', 'Jika ditarik cepat, gelas tetap diam karena inersia benda diam.')}
                            ${card('🏍️', 'Motor belok tajam', 'Badan terasa terlempar ke luar karena cenderung lurus terus.')}
                            ${card('⚖️', 'Massa & inersia', 'Makin besar massa, makin besar inersia — truk lebih sulit dihentikan daripada sepeda.')}
                        </div>
                        ${key('💡', 'Inersia bukan gaya! Itu sifat benda untuk mempertahankan keadaannya.')}`
                },
                {
                    title: '🎮 Hukum II Newton — Simulasi F = m·a',
                    content: `
                        <p><strong>a = ΣF / m</strong>. Geser slider dan lihat bagaimana percepatan berubah!</p>
                        <div class="widget">
                            <div class="w-row"><label>Massa (m): <b id="nw-m-val">10</b> kg</label>
                                <input type="range" id="nw-m" min="1" max="50" value="10" oninput="Materi.newtonUpdate()"></div>
                            <div class="w-row"><label>Gaya (F): <b id="nw-f-val">50</b> N</label>
                                <input type="range" id="nw-f" min="0" max="200" step="5" value="50" oninput="Materi.newtonUpdate()"></div>
                            <div class="w-track"><div class="w-box" id="nw-box">📦</div></div>
                            <div class="w-result">a = F/m = <span id="nw-a">5.0</span> m/s²</div>
                            <div class="w-hint" id="nw-hint"></div>
                        </div>
                        ${key('🧠', 'Gaya tetap → massa makin besar, percepatan makin kecil. Massa tetap → gaya makin besar, percepatan makin besar.')}`,
                    init() { Materi.newtonUpdate(); }
                },
                {
                    title: '🔁 Hukum III Newton — Aksi-Reaksi',
                    content: `
                        <p>"Jika benda A mengerjakan gaya pada B, maka B mengerjakan gaya pada A yang <strong>sama besar, berlawanan arah</strong>."</p>
                        <p style="font-size:13px;"><strong>F<sub>aksi</sub> = −F<sub>reaksi</sub></strong> — bekerja pada <u>dua benda berbeda</u>.</p>
                        <div class="info-cards">
                            ${card('🚀', 'Roket', 'Gas didorong ke bawah (aksi) → roket terdorong ke atas (reaksi).')}
                            ${card('🏊', 'Berenang', 'Tangan mendorong air ke belakang → air mendorong tubuh ke depan.')}
                            ${card('🚶', 'Berjalan', 'Kaki mendorong tanah ke belakang → tanah mendorong kaki ke depan.')}
                            ${card('🔫', 'Tolakan senapan', 'Peluru melaju ke depan → senapan terdorong ke belakang.')}
                        </div>
                        ${key('⚠️', 'Kesalahan umum: aksi-reaksi TIDAK saling meniadakan, karena bekerja pada benda yang berbeda.')}`
                },
                {
                    title: '🎯 Ringkasan & Contoh Soal',
                    content: `
                        <div class="visual-box" style="text-align:left;font-size:14px;line-height:1.9;">
                            <b>I</b> &nbsp;: ΣF = 0 → a = 0 (inersia)<br>
                            <b>II</b> : ΣF = m·a<br>
                            <b>III</b>: F<sub>aksi</sub> = −F<sub>reaksi</sub><br>
                            <b>Berat</b>: w = m·g (g ≈ 10 m/s²)
                        </div>
                        ${key('📝', '<b>Contoh:</b> Benda 5 kg didorong 20 N di lantai licin. a = 20/5 = <b>4 m/s²</b>. Kecepatan setelah 3 s: v = 4×3 = <b>12 m/s</b>.')}
                        ${key('🏁', 'Siap uji pemahaman? Buka tab <b>Kuis</b> dan pilih soal Fisika!')}`
                }
            ]
        },

        // ================= MATEMATIKA =================
        {
            id: 'kuadrat', icon: '📈', subject: 'Matematika', grade: 'Kelas X', color: '#00B894',
            title: 'Fungsi & Persamaan Kuadrat',
            desc: 'Eksplor parabola secara visual: ubah a, b, c dan lihat akar serta diskriminannya.',
            duration: '12 menit',
            steps: [
                {
                    title: '🧩 Bentuk Umum & Arah Parabola',
                    content: `
                        <p>Fungsi kuadrat: <strong>f(x) = ax² + bx + c</strong>, dengan a ≠ 0. Grafiknya berbentuk <strong>parabola</strong>.</p>
                        <div class="info-cards">
                            ${card('🙂', 'a > 0', 'Parabola terbuka ke ATAS, punya titik minimum.')}
                            ${card('🙁', 'a < 0', 'Parabola terbuka ke BAWAH, punya titik maksimum.')}
                            ${card('📍', 'c', 'Titik potong sumbu-y adalah (0, c).')}
                            ${card('🪞', 'Sumbu simetri', 'x = −b / 2a — membagi parabola jadi dua sisi sama.')}
                        </div>
                        ${key('💡', 'Titik puncak: (−b/2a , f(−b/2a)). Semua soal "nilai maksimum/minimum" bermuara ke sini!')}`
                },
                {
                    title: '🎮 Simulasi Parabola',
                    content: `
                        <p>Ubah koefisien dan amati grafik, diskriminan, serta akarnya secara langsung.</p>
                        <div class="widget">
                            <svg id="pb-svg" viewBox="0 0 300 220" class="w-svg"></svg>
                            <div class="w-row"><label>a = <b id="pb-a-val">1</b></label><input type="range" id="pb-a" min="-3" max="3" step="0.5" value="1" oninput="Materi.parabolaUpdate()"></div>
                            <div class="w-row"><label>b = <b id="pb-b-val">-4</b></label><input type="range" id="pb-b" min="-8" max="8" step="1" value="-4" oninput="Materi.parabolaUpdate()"></div>
                            <div class="w-row"><label>c = <b id="pb-c-val">3</b></label><input type="range" id="pb-c" min="-8" max="8" step="1" value="3" oninput="Materi.parabolaUpdate()"></div>
                            <div class="w-result" id="pb-info"></div>
                        </div>`,
                    init() { Materi.parabolaUpdate(); }
                },
                {
                    title: '🔑 Diskriminan & Akar-akar',
                    content: `
                        <p>Akar persamaan ax² + bx + c = 0 dicari dengan <strong>rumus ABC</strong>:</p>
                        <div class="visual-box" style="font-size:16px;"><b>x = (−b ± √D) / 2a</b>, &nbsp; D = b² − 4ac</div>
                        <div class="info-cards">
                            ${card('✌️', 'D > 0', 'Dua akar real berbeda — parabola memotong sumbu-x di dua titik.')}
                            ${card('☝️', 'D = 0', 'Akar kembar — parabola menyinggung sumbu-x.')}
                            ${card('🚫', 'D < 0', 'Tidak ada akar real — parabola tidak menyentuh sumbu-x.')}
                            ${card('✅', 'Contoh', 'x² − 4x + 3: D = 16 − 12 = 4 → x = (4 ± 2)/2 = 3 atau 1.')}
                        </div>
                        ${key('🧠', 'Coba kembali ke simulasi: atur a, b, c supaya D < 0, lalu lihat grafiknya!')}`
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        <div class="visual-box" style="text-align:left;font-size:14px;line-height:1.9;">
                            • Bentuk: f(x) = ax² + bx + c<br>
                            • Sumbu simetri: x = −b/2a<br>
                            • Puncak: (−b/2a, −D/4a)<br>
                            • Akar: x = (−b ± √D)/2a<br>
                            • D = b² − 4ac menentukan jumlah akar real
                        </div>
                        ${key('📝', '<b>Contoh:</b> Tinggi bola h(t) = −5t² + 20t. Waktu tertinggi t = −20/(2·−5) = 2 s, tinggi maks = −20 + 40 = <b>20 m</b>.')}`
                }
            ]
        },

        // ================= KIMIA =================
        {
            id: 'atom', icon: '⚛️', subject: 'Kimia', grade: 'Kelas X', color: '#E17055',
            title: 'Struktur Atom & Tabel Periodik',
            desc: 'Bangun atom unsur 1–20 sendiri: proton, neutron, elektron, kulit & golongan.',
            duration: '12 menit',
            steps: [
                {
                    title: '🔬 Partikel Penyusun Atom',
                    content: `
                        <p>Atom terdiri dari inti (proton & neutron) dan elektron yang mengelilingi inti.</p>
                        <div class="info-cards">
                            ${card('➕', 'Proton (p⁺)', 'Muatan +1, massa ≈ 1 sma. Jumlahnya = nomor atom (Z).')}
                            ${card('⚪', 'Neutron (n)', 'Tidak bermuatan, massa ≈ 1 sma. Jumlah n = A − Z.')}
                            ${card('➖', 'Elektron (e⁻)', 'Muatan −1, massa sangat kecil. Atom netral: e = p.')}
                            ${card('🔢', 'Notasi atom', 'ᴬ_Z X — A = nomor massa (p+n), Z = nomor atom (p).')}
                        </div>
                        ${key('🧬', '<b>Isotop</b>: Z sama, A beda (contoh ¹²C & ¹⁴C). <b>Isobar</b>: A sama, Z beda. <b>Isoton</b>: jumlah neutron sama.')}`
                },
                {
                    title: '🎮 Bangun Atommu!',
                    content: `
                        <p>Geser slider nomor atom (1–20) untuk membangun atom dan lihat konfigurasi elektronnya.</p>
                        <div class="widget">
                            <svg id="at-svg" viewBox="0 0 260 260" class="w-svg" style="max-width:260px;"></svg>
                            <div class="w-row"><label>Nomor atom (Z) = <b id="at-z-val">11</b></label><input type="range" id="at-z" min="1" max="20" value="11" oninput="Materi.atomUpdate()"></div>
                            <div class="w-result" id="at-info"></div>
                        </div>`,
                    init() { Materi.atomUpdate(); }
                },
                {
                    title: '📊 Konfigurasi Elektron & Golongan',
                    content: `
                        <p>Isi kulit mulai dari dalam: <strong>K (maks 2), L (maks 8), M (maks 8 untuk Z ≤ 20), N</strong>.</p>
                        <div class="info-cards">
                            ${card('🔟', 'Contoh Ne (Z=10)', '2, 8 → kulit terluar penuh → gas mulia, stabil.')}
                            ${card('🧂', 'Contoh Na (Z=11)', '2, 8, 1 → valensi 1 → golongan IA (alkali), mudah melepas e⁻.')}
                            ${card('🧪', 'Contoh Cl (Z=17)', '2, 8, 7 → valensi 7 → golongan VIIA (halogen), mudah menerima e⁻.')}
                            ${card('📏', 'Periode', 'Jumlah kulit berisi elektron = nomor periode.')}
                        </div>
                        ${key('💡', 'Golongan (utama) = jumlah elektron valensi. Periode = jumlah kulit. Bandingkan dengan simulasi sebelumnya!')}`
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        <div class="visual-box" style="text-align:left;font-size:14px;line-height:1.9;">
                            • Z = p = e (atom netral)<br>
                            • A = p + n → n = A − Z<br>
                            • Elektron valensi → golongan<br>
                            • Jumlah kulit → periode<br>
                            • Aturan oktet: 8 elektron valensi = stabil
                        </div>
                        ${key('📝', '<b>Contoh:</b> ³⁵₁₇Cl → p = 17, e = 17, n = 18, konfigurasi 2,8,7 → golongan VIIA periode 3.')}`
                }
            ]
        },

        // ================= BIOLOGI =================
        {
            id: 'sel', icon: '🧫', subject: 'Biologi', grade: 'Kelas XI', color: '#0984E3',
            title: 'Sel & Transpor Membran',
            desc: 'Jelajahi organel sel dan cara zat bergerak masuk-keluar sel: difusi, osmosis, transpor aktif.',
            duration: '12 menit',
            steps: [
                {
                    title: '🏭 Organel — "Pabrik" di Dalam Sel',
                    content: `
                        <p>Sel itu seperti kota mini. Klik tiap organel untuk tahu tugasnya:</p>
                        <div class="info-cards">
                            ${card('🧠', 'Nukleus', 'Pusat kendali; menyimpan DNA dan mengatur aktivitas sel.')}
                            ${card('🔋', 'Mitokondria', 'Respirasi sel → menghasilkan ATP (energi).')}
                            ${card('🧵', 'Ribosom', 'Tempat sintesis protein.')}
                            ${card('📦', 'Badan Golgi', 'Memodifikasi, mengemas, dan mengirim protein/lipid.')}
                            ${card('🗑️', 'Lisosom', 'Enzim pencernaan; menguraikan sisa dan organel rusak.')}
                            ${card('🍃', 'Kloroplas', 'Hanya pada sel tumbuhan; tempat fotosintesis.')}
                        </div>
                        ${key('🔍', 'Sel hewan vs tumbuhan: tumbuhan punya dinding sel, kloroplas, dan vakuola besar; hewan punya sentriol.')}`
                },
                {
                    title: '🚪 Membran Plasma: Penjaga Gerbang',
                    content: `
                        <p>Membran plasma bersifat <strong>semipermeabel</strong>: model <em>mosaik cair</em> (lapisan fosfolipid ganda + protein).</p>
                        <div class="info-cards">
                            ${card('💧', 'Fosfolipid', 'Kepala hidrofilik (suka air) di luar, ekor hidrofobik di dalam.')}
                            ${card('🚇', 'Protein kanal/pembawa', 'Memfasilitasi zat tertentu melewati membran.')}
                            ${card('🆔', 'Glikoprotein', 'Pengenalan antar sel & reseptor sinyal.')}
                            ${card('🛢️', 'Kolesterol', 'Menjaga kestabilan dan kelenturan membran (sel hewan).')}
                        </div>`
                },
                {
                    title: '🔄 Jenis Transpor Zat',
                    content: `
                        <p>Tebak dulu! Klik kartu untuk melihat jawabannya.</p>
                        <div class="info-cards">
                            ${card('➡️', 'Difusi', 'Zat bergerak dari konsentrasi TINGGI ke RENDAH. Pasif, tanpa energi. Contoh: O₂ masuk sel.')}
                            ${card('💦', 'Osmosis', 'Difusi AIR lewat membran semipermeabel, dari larutan encer ke pekat.')}
                            ${card('⚡', 'Transpor aktif', 'Melawan gradien konsentrasi, butuh protein pembawa + ATP. Contoh: pompa Na⁺/K⁺.')}
                            ${card('🫧', 'Endo/Eksositosis', 'Transpor partikel besar dengan membentuk vesikel (fagositosis, pinositosis).')}
                        </div>
                        ${key('🌱', '<b>Osmosis pada sel:</b> hipotonik → sel hewan lisis / sel tumbuhan turgid. Hipertonik → sel mengerut (krenasi / plasmolisis). Isotonik → seimbang.')}`
                },
                {
                    title: '🎯 Ringkasan',
                    content: `
                        <div class="visual-box" style="text-align:left;font-size:14px;line-height:1.9;">
                            • Pasif: difusi, osmosis, difusi terfasilitasi<br>
                            • Aktif: transpor aktif, endositosis, eksositosis<br>
                            • Mitokondria → ATP · Ribosom → protein<br>
                            • Lisosom → pencernaan · Golgi → pengemasan
                        </div>
                        ${key('🏁', 'Uji dirimu di tab <b>Kuis</b> kategori Biologi, atau tanya <b>AI Tutor</b> kalau ada yang belum jelas!')}`
                }
            ]
        }
    ];

    let currentLessonId = null;
    let currentStepIndex = 0;
    let currentSubjectFilter = 'Semua';

    const SUBJECT_ORDER = ['Fisika', 'Matematika', 'Kimia', 'Biologi', 'Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah'];
    const SUBJECT_ICONS = {
        Fisika: '🚀',
        Matematika: '📈',
        Kimia: '⚛️',
        Biologi: '🧫',
        Ekonomi: '💹',
        Sosiologi: '🤝',
        Geografi: '🌋',
        Sejarah: '🇮🇩'
    };

    const TRACKS = { newton: ['ipa'], kuadrat: ['ipa', 'ips'], atom: ['ipa'], sel: ['ipa'] };
    const tracksOf = l => l.tracks || TRACKS[l.id] || ['ipa', 'ips'];
    function visible() {
        const t = App.getState().track || 'ipa';
        return LESSONS.filter(l => tracksOf(l).includes(t));
    }
    function count() { return visible().length; }
    function completedCount() {
        const done = App.getState().completedLessons;
        return visible().filter(l => done.includes(l.id)).length;
    }
    function register(list) { list.forEach(l => { if (!LESSONS.some(x => x.id === l.id)) LESSONS.push(l); }); }

    function setSubjectFilter(subj) {
        currentSubjectFilter = subj;
        renderList();
        const page = document.getElementById('page-materi');
        if (page && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function renderLessonCard(l, state) {
        const done = state.completedLessons.includes(l.id);
        const prog = state.lessonProgress[l.id] || 0;
        const pct = done ? 100 : Math.round((prog / l.steps.length) * 100);
        return `
        <div class="lesson-card card-clickable" style="--lc:${l.color}" onclick="Materi.openLesson('${l.id}')">
            <div class="lc-icon" style="background:${l.color}22">${l.icon}</div>
            <div class="lc-info">
                <div class="lc-title">${l.title}</div>
                <div class="lc-desc">${l.desc}</div>
                <div class="lc-meta">
                    <span class="badge badge-primary lc-badge">${l.subject}</span>
                    <span class="badge badge-warning lc-badge">${l.grade}</span>
                    <span class="badge badge-success lc-badge">⏱️ ${l.duration}</span>
                    ${done ? '<span class="badge badge-success lc-badge">✅ Selesai</span>' : ''}
                </div>
                ${!done && prog > 0 ? `<div class="progress-bar" style="margin-top:8px;"><div class="progress-fill" style="width:${pct}%"></div></div>` : ''}
            </div>
            <span class="lc-arrow">→</span>
        </div>`;
    }

    // ---------- LIST ----------
    function renderList() {
        const page = document.getElementById('page-materi');
        const state = App.getState();
        const track = (state.track || 'ipa').toUpperCase();
        const allVisible = visible();

        // Cari mata pelajaran apa saja yang ada pada jurusan saat ini
        const presentSubjects = SUBJECT_ORDER.filter(s => allVisible.some(l => l.subject === s));

        // Jika filter yang dipilih tidak ada pada jurusan ini, reset ke 'Semua'
        if (currentSubjectFilter !== 'Semua' && !presentSubjects.includes(currentSubjectFilter)) {
            currentSubjectFilter = 'Semua';
        }

        let contentHtml = '';

        if (currentSubjectFilter !== 'Semua') {
            // Mode per mata pelajaran: tampilkan banner dan materi mata pelajaran terpilih
            const filtered = allVisible.filter(l => l.subject === currentSubjectFilter);
            const icon = SUBJECT_ICONS[currentSubjectFilter] || '📘';
            const completedCount = filtered.filter(l => state.completedLessons.includes(l.id)).length;

            contentHtml = `
                <div class="subject-banner">
                    <div class="sb-left">
                        <span class="sb-icon">${icon}</span>
                        <div>
                            <h3 class="sb-title">Menu Materi ${currentSubjectFilter}</h3>
                            <p class="sb-desc">${filtered.length} materi interaktif • ${completedCount}/${filtered.length} selesai</p>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline" onclick="Materi.setSubjectFilter('Semua')">← Lihat Semua Mapel</button>
                </div>
                <div class="lesson-grid">
                    ${filtered.map(l => renderLessonCard(l, state)).join('')}
                </div>
            `;
        } else {
            // Mode semua mata pelajaran: dikelompokkan secara terstruktur per mata pelajaran
            contentHtml = presentSubjects.map(subj => {
                const subjectLessons = allVisible.filter(l => l.subject === subj);
                const icon = SUBJECT_ICONS[subj] || '📘';
                const completedInSubj = subjectLessons.filter(l => state.completedLessons.includes(l.id)).length;
                return `
                    <div class="subject-group-section">
                        <div class="subject-section-header">
                            <div class="ssh-title-wrap">
                                <span class="ssh-icon">${icon}</span>
                                <h3 class="ssh-title">${subj}</h3>
                                <span class="badge badge-primary">${subjectLessons.length} Materi</span>
                                ${completedInSubj > 0 ? `<span class="badge badge-success">${completedInSubj}/${subjectLessons.length} Selesai</span>` : ''}
                            </div>
                            <button class="ssh-link-btn" onclick="Materi.setSubjectFilter('${subj}')">Hanya ${subj} →</button>
                        </div>
                        <div class="lesson-grid">
                            ${subjectLessons.map(l => renderLessonCard(l, state)).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        page.innerHTML = `
            <h2 class="section-title" style="margin-top:0;">📖 Materi Interaktif SMA — ${track}</h2>
            <p class="section-subtitle">Materi sudah dikelompokkan per mata pelajaran. Klik menu mata pelajaran di bawah untuk memilih!</p>

            <!-- Menu Filter Tab Mata Pelajaran -->
            <div class="subject-filter-nav">
                <button class="chip ${currentSubjectFilter === 'Semua' ? 'active' : ''}" onclick="Materi.setSubjectFilter('Semua')">
                    🌟 Semua Mapel (${allVisible.length})
                </button>
                ${presentSubjects.map(s => {
                    const count = allVisible.filter(l => l.subject === s).length;
                    const icon = SUBJECT_ICONS[s] || '📘';
                    return `
                        <button class="chip ${currentSubjectFilter === s ? 'active' : ''}" onclick="Materi.setSubjectFilter('${s}')">
                            ${icon} ${s} (${count})
                        </button>
                    `;
                }).join('')}
            </div>

            ${contentHtml}
        `;
    }

    function openLesson(id) {
        const l = LESSONS.find(x => x.id === id);
        if (!l) return;
        currentLessonId = id;
        const s = App.getState();
        currentStepIndex = s.completedLessons.includes(id) ? 0 : (s.lessonProgress[id] || 0);
        if (currentStepIndex >= l.steps.length) currentStepIndex = 0;
        renderStep();
    }

    function renderStep() {
        const l = LESSONS.find(x => x.id === currentLessonId);
        if (!l) return;
        const step = l.steps[currentStepIndex];
        const total = l.steps.length;
        const first = currentStepIndex === 0;
        const last = currentStepIndex === total - 1;

        document.getElementById('page-materi').innerHTML = `
            <div class="lesson-viewer">
                <div class="lesson-header">
                    <button class="btn-back" onclick="Materi.backToList()">←</button>
                    <h2>${l.icon} ${l.title}</h2>
                </div>
                <div class="step-progress">
                    ${l.steps.map((_, i) => `<div class="step-dot ${i < currentStepIndex ? 'completed' : i === currentStepIndex ? 'current' : ''}"></div>`).join('')}
                </div>
                <div class="step-content" style="border-top:4px solid ${l.color}">
                    <h3>${step.title}</h3>
                    ${step.content}
                </div>
                <div class="step-nav">
                    ${first ? '<div></div>' : '<button class="btn btn-secondary" onclick="Materi.prevStep()">← Sebelumnya</button>'}
                    ${last ? '<button class="btn btn-success btn-lg" onclick="Materi.completeLesson()">✅ Selesai!</button>'
                           : '<button class="btn btn-primary" onclick="Materi.nextStep()">Selanjutnya →</button>'}
                </div>
                <button class="btn btn-outline btn-full" style="margin-top:14px;" onclick="AITutor.askAbout('${l.title.replace(/'/g, '')} — ${step.title.replace(/<[^>]*>/g, '').replace(/'/g, '')}')">🤖 Bingung? Tanya AI Tutor tentang bagian ini</button>
            </div>`;

        const prog = { ...App.getState().lessonProgress, [currentLessonId]: currentStepIndex };
        App.setState({ lessonProgress: prog });
        if (typeof step.init === 'function') step.init();
    }

    function nextStep() {
        const l = LESSONS.find(x => x.id === currentLessonId);
        if (currentStepIndex < l.steps.length - 1) {
            currentStepIndex++;
            renderStep();
            if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    function prevStep() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep();
            if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function completeLesson() {
        const s = App.getState();
        const l = LESSONS.find(x => x.id === currentLessonId);
        const completed = [...s.completedLessons];
        let gained = 0;
        if (!completed.includes(currentLessonId)) {
            completed.push(currentLessonId);
            const streak = s.currentStreak + 1;
            App.setState({ completedLessons: completed, currentStreak: streak, bestStreak: Math.max(s.bestStreak, streak) });
            gained = 50;
            App.addXP(50);
        }
        App.confetti();
        App.showModal(`
            <div style="font-size:64px;margin-bottom:12px;">🎉</div>
            <h2>Materi Selesai!</h2>
            <p><strong>${l.icon} ${l.title}</strong></p>
            ${gained ? '<p><span class="badge badge-warning">+50 XP</span></p>' : ''}
            <p>Keren! Yuk uji pemahamanmu lewat kuis ${l.subject}.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button class="btn btn-secondary" onclick="App.closeModal(); Materi.backToList();">Kembali</button>
                <button class="btn btn-primary" onclick="App.closeModal(); App.navigate('kuis');">🧠 Mulai Kuis</button>
            </div>`);
    }

    function backToList() { currentLessonId = null; currentStepIndex = 0; renderList(); }
    function revealCard(el) { el.classList.toggle('revealed'); }

    // ================= WIDGETS =================
    function newtonUpdate() {
        const m = +document.getElementById('nw-m').value;
        const f = +document.getElementById('nw-f').value;
        const a = f / m;
        document.getElementById('nw-m-val').textContent = m;
        document.getElementById('nw-f-val').textContent = f;
        document.getElementById('nw-a').textContent = a.toFixed(1);
        const box = document.getElementById('nw-box');
        box.style.fontSize = (20 + m * 0.6) + 'px';
        box.style.animationDuration = a > 0 ? Math.max(0.4, 4 / (a + 0.5)) + 's' : '0s';
        box.classList.toggle('moving', a > 0);
        document.getElementById('nw-hint').textContent =
            a === 0 ? '🛑 Tidak ada gaya → benda diam (Hukum I)' :
            a < 2 ? '🐢 Percepatan kecil — benda berat/gaya kecil' :
            a < 8 ? '🚗 Percepatan sedang' : '🚀 Percepatan besar!';
    }

    function parabolaUpdate() {
        const a = +document.getElementById('pb-a').value || 0.5;
        const b = +document.getElementById('pb-b').value;
        const c = +document.getElementById('pb-c').value;
        document.getElementById('pb-a-val').textContent = a;
        document.getElementById('pb-b-val').textContent = b;
        document.getElementById('pb-c-val').textContent = c;

        const W = 300, H = 220, sx = 22, sy = 12, ox = W / 2, oy = H / 2;
        const X = x => ox + x * sx, Y = y => oy - y * sy;
        let pts = [];
        for (let x = -6.8; x <= 6.8; x += 0.1) {
            const y = a * x * x + b * x + c;
            if (Math.abs(y) <= 9.5) pts.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
        }
        const D = b * b - 4 * a * c;
        const xv = -b / (2 * a), yv = a * xv * xv + b * xv + c;
        let roots = [];
        if (D >= 0) { const r = Math.sqrt(D); roots = D === 0 ? [-b / (2 * a)] : [(-b - r) / (2 * a), (-b + r) / (2 * a)]; }

        let grid = '';
        for (let i = -6; i <= 6; i++) grid += `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${H}" stroke="var(--border)" stroke-width="0.5"/>`;
        for (let j = -9; j <= 9; j++) grid += `<line x1="0" y1="${Y(j)}" x2="${W}" y2="${Y(j)}" stroke="var(--border)" stroke-width="0.5"/>`;

        document.getElementById('pb-svg').innerHTML = `
            ${grid}
            <line x1="0" y1="${oy}" x2="${W}" y2="${oy}" stroke="var(--text-muted)"/>
            <line x1="${ox}" y1="0" x2="${ox}" y2="${H}" stroke="var(--text-muted)"/>
            <polyline points="${pts.join(' ')}" fill="none" stroke="#6C5CE7" stroke-width="3" stroke-linecap="round"/>
            ${Math.abs(yv) <= 9.5 && Math.abs(xv) <= 6.8 ? `<circle cx="${X(xv)}" cy="${Y(yv)}" r="5" fill="#FDCB6E" stroke="#333"/>` : ''}
            ${roots.filter(r => Math.abs(r) <= 6.8).map(r => `<circle cx="${X(r)}" cy="${oy}" r="5" fill="#00B894" stroke="#fff"/>`).join('')}`;

        const f = n => (Math.round(n * 100) / 100).toString();
        document.getElementById('pb-info').innerHTML = `
            f(x) = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}<br>
            D = ${f(D)} → ${D > 0 ? '✌️ dua akar: x = ' + roots.map(f).join(' & ') : D === 0 ? '☝️ akar kembar: x = ' + f(roots[0]) : '🚫 tidak ada akar real'}<br>
            Puncak (🟡): (${f(xv)}, ${f(yv)}) • Terbuka ke ${a > 0 ? 'atas 🙂' : 'bawah 🙁'}`;
    }

    function atomUpdate() {
        let z = +(document.getElementById('at-z')?.value || 11);
        if (isNaN(z) || z < 1 || z > 20) z = 11;
        const [sym, name, mass] = ELEMENTS[z - 1];
        const zVal = document.getElementById('at-z-val');
        if (zVal) zVal.textContent = z;
        const caps = [2, 8, 8, 2];
        let left = z, shells = [];
        for (const cap of caps) { if (left <= 0) break; const t = Math.min(cap, left); shells.push(t); left -= t; }

        const cx = 130, cy = 130;
        let svg = '';
        shells.forEach((n, i) => {
            const r = 48 + i * 24;
            svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
            for (let k = 0; k < n; k++) {
                const ang = (2 * Math.PI * k) / n - Math.PI / 2;
                svg += `<circle cx="${cx + r * Math.cos(ang)}" cy="${cy + r * Math.sin(ang)}" r="5" fill="#0984E3"/>`;
            }
        });
        svg += `<circle cx="${cx}" cy="${cy}" r="26" fill="#E17055"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">${sym}</text>`;
        document.getElementById('at-svg').innerHTML = svg;

        const val = shells[shells.length - 1];
        const group = val === 8 || z === 2 ? 'VIIIA (gas mulia)' : ['', 'IA', 'IIA', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA'][val];
        document.getElementById('at-info').innerHTML = `
            <b>${name} (${sym})</b> — ᴬ${mass}_${z}${sym}<br>
            🔴 Proton: ${z} • ⚪ Neutron: ${mass - z} • 🔵 Elektron: ${z}<br>
            Konfigurasi: <b>${shells.join(', ')}</b><br>
            Valensi: ${z === 2 ? 2 : val} • Golongan ${group} • Periode ${shells.length}`;
    }

    function init() {
        document.addEventListener('DOMContentLoaded', renderList);
    }
    init();

    return { renderList, setSubjectFilter, openLesson, nextStep, prevStep, completeLesson, backToList, revealCard, count, completedCount, register, visible, newtonUpdate, parabolaUpdate, atomUpdate };
})();

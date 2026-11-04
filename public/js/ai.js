/* ============================================================
   RuangPintar — ai.js
   AI Tutor: bertanya materi SMA kapan saja.
   - Mode ONLINE : Google Gemini API (butuh API key, disimpan di browser)
   - Mode OFFLINE: basis pengetahuan bawaan (tanpa internet / tanpa key)
   ============================================================ */

const AITutor = (() => {
    const CFG_KEY = 'ruangpintar_ai_cfg';
    const SYSTEM = `Kamu adalah "Pintar", tutor AI yang ramah untuk siswa SMA Indonesia di platform RuangPintar.
Aturan:
- Jawab dalam Bahasa Indonesia yang santai tapi jelas, sesuai kurikulum SMA (Fisika, Matematika, Kimia, Biologi, dll).
- Jelaskan langkah demi langkah, beri contoh singkat dan analogi sehari-hari.
- Untuk soal hitungan, tunjukkan langkah penyelesaian, lalu ajak siswa mencoba soal serupa.
- Jawaban ringkas (maks ~180 kata), gunakan poin-poin dan **tebal** untuk istilah kunci.
- Siswa mungkin malu bertanya: selalu apresiasi pertanyaannya dan jangan menghakimi.
- Jika di luar topik belajar, arahkan kembali dengan sopan.`;

    const KB = [
        { k: ['glbb', 'glb ', 'gerak lurus', 'jatuh bebas', 'percepatan tetap'], a: '**GLB**: kecepatan tetap, s = v·t.\n**GLBB**: percepatan tetap, v = v₀ + a·t dan s = v₀·t + ½·a·t².\n**Jatuh bebas**: a = g ≈ 10 m/s², v = g·t, h = ½·g·t².\n\nIngat: luas di bawah grafik v–t = jarak tempuh.' },
        { k: ['trigonometri', ' sin ', ' cos ', ' tan ', 'soh'], a: '**SOH-CAH-TOA**:\n- sin θ = depan / miring\n- cos θ = samping / miring\n- tan θ = depan / samping\n\nSudut istimewa: sin 30° = ½, sin 45° = ½√2, sin 60° = ½√3. Identitas: sin²θ + cos²θ = 1.' },
        { k: [' mol ', ' mol?', 'avogadro', 'stoikiometri', 'massa molar'], a: '**Mol**: n = massa / Mr. Jumlah partikel = n × 6,02×10²³. Volume gas STP = n × 22,4 L.\nContoh: 36 g air (Mr 18) = **2 mol**. Koefisien reaksi = perbandingan mol.' },
        { k: ['mendel', 'genotipe', 'fenotipe', 'punnett', 'resesif', 'persilangan', 'genetika'], a: '**Mendel I**: alel memisah saat pembentukan gamet; Aa × Aa → genotipe 1 : 2 : 1, fenotipe 3 : 1.\n**Mendel II**: dihibrid AaBb × AaBb → fenotipe 9 : 3 : 3 : 1.\nGenotipe = susunan gen (Aa), fenotipe = sifat tampak.' },
        { k: ['statistika', ' mean', 'median', 'modus', 'rata-rata', 'jangkauan'], a: '**Mean** = jumlah data ÷ banyak data. **Median** = nilai tengah (data terurut). **Modus** = paling sering muncul. **Jangkauan** = max − min.\nContoh 4, 6, 6, 8, 11: mean 7, median 6, modus 6.' },
        { k: ['permintaan', 'penawaran', 'keseimbangan pasar', 'harga keseimbangan', 'surplus', 'shortage', 'ekonomi'], a: '**Hukum permintaan**: harga ↑ → jumlah diminta ↓. **Hukum penawaran**: harga ↑ → jumlah ditawarkan ↑.\n**Keseimbangan**: Qd = Qs. Harga di atas keseimbangan → **surplus**; di bawahnya → **kelangkaan**.\nPerubahan harga = bergerak di sepanjang kurva; faktor lain (pendapatan, selera) = kurva **bergeser**.' },
        { k: ['akulturasi', 'asimilasi', 'interaksi sosial', 'kelompok sosial', 'sosiologi', 'kontravensi', 'akomodasi', 'gemeinschaft', 'paguyuban'], a: '**Asosiatif**: kerja sama, akomodasi, asimilasi (budaya melebur), akulturasi (budaya bercampur, ciri asli tetap).\n**Disosiatif**: persaingan, kontravensi, pertentangan.\nKelompok primer = akrab (keluarga); sekunder = formal (organisasi).' },
        { k: ['lempeng', 'tektonik', 'gempa', 'litosfer', 'gunung api', 'tsunami', 'cincin api', 'geografi'], a: '**Batas lempeng**: divergen (menjauh), konvergen (bertumbukan/subduksi), transform (bergeser mendatar).\nIndonesia berada di pertemuan lempeng **Eurasia, Indo-Australia, Pasifik** dan di jalur **Cincin Api Pasifik**, sehingga rawan gempa dan gunung api. Upaya sebelum bencana = **mitigasi**.' },
        { k: ['proklamasi', 'rengasdengklok', 'budi utomo', 'sumpah pemuda', 'ppki', 'bpupki', 'kemerdekaan', 'sejarah'], a: '**Linimasa**: 1908 Budi Utomo → 1928 Sumpah Pemuda → 1942 Jepang masuk → 1945 BPUPKI → 16 Agu Rengasdengklok → **17 Agu 1945 Proklamasi** → 18 Agu PPKI mengesahkan UUD 1945 dan memilih presiden-wakil presiden.' },
        { k: ['newton', 'hukum 1', 'hukum i ', 'inersia'], a: '**Hukum I Newton (Inersia)**: benda diam tetap diam, benda bergerak tetap bergerak lurus beraturan, *selama resultan gaya = 0*. Contoh: penumpang terdorong ke depan saat bus mengerem.\n\nCoba buka materi **Hukum Newton** untuk simulasinya! 🚀' },
        { k: ['hukum 2', 'f=ma', 'f = m', 'percepatan', 'gaya dan massa'], a: '**Hukum II Newton**: ΣF = m·a → a = F/m.\n- Gaya makin besar → percepatan makin besar\n- Massa makin besar → percepatan makin kecil\n\nContoh: m = 5 kg, F = 20 N → a = 20/5 = **4 m/s²**.' },
        { k: ['aksi', 'reaksi', 'hukum 3', 'hukum iii'], a: '**Hukum III Newton**: F aksi = −F reaksi. Keduanya sama besar, berlawanan arah, dan bekerja pada **dua benda berbeda**, jadi tidak saling meniadakan. Contoh: roket menyemburkan gas ke bawah, roket terdorong ke atas.' },
        { k: ['massa dan berat', 'beda massa', 'berat'], a: '**Massa** (kg) = jumlah materi, tetap di mana pun. **Berat** (N) = gaya gravitasi, w = m·g. Di Bulan massamu sama, tapi beratmu sekitar 1/6 berat di Bumi.' },
        { k: ['diskriminan', 'rumus abc', 'akar'], a: '**Diskriminan** D = b² − 4ac:\n- D > 0 → dua akar real berbeda\n- D = 0 → akar kembar\n- D < 0 → tidak ada akar real\n\nAkar: x = (−b ± √D) / 2a. Contoh x² − 4x + 3: D = 4 → x = 1 atau 3.' },
        { k: ['kuadrat', 'parabola', 'puncak', 'sumbu simetri'], a: '**Fungsi kuadrat** f(x) = ax² + bx + c berbentuk parabola.\n- a > 0 buka ke atas, a < 0 ke bawah\n- Sumbu simetri: x = −b/2a\n- Puncak: (−b/2a, f(−b/2a))\n\nMainkan simulasinya di materi **Fungsi & Persamaan Kuadrat**! 📈' },
        { k: ['elektron valensi', 'valensi', 'golongan', 'periode', 'konfigurasi'], a: '**Cara cepat**: isi kulit 2, 8, 8, … sampai elektron habis. Kulit terakhir = **elektron valensi** = nomor **golongan** (utama). Jumlah kulit = **periode**.\n\nContoh Cl (Z=17): 2, 8, 7 → golongan VIIA, periode 3.' },
        { k: ['isotop', 'isobar', 'isoton', 'nomor massa', 'nomor atom'], a: '**Nomor atom (Z)** = proton. **Nomor massa (A)** = proton + neutron.\n- Isotop: Z sama, A beda\n- Isobar: A sama, Z beda\n- Isoton: neutron sama\n\nNeutron = A − Z.' },
        { k: ['atom', 'proton', 'neutron', 'elektron'], a: 'Atom = inti (**proton +**, **neutron netral**) + **elektron −** di kulit. Atom netral: jumlah proton = jumlah elektron. Coba "Bangun Atommu" di materi **Struktur Atom**! ⚛️' },
        { k: ['osmosis', 'hipotonik', 'hipertonik', 'isotonik'], a: '**Osmosis** = perpindahan air lewat membran semipermeabel dari larutan encer ke pekat.\n- **Hipotonik** (lebih encer) → air masuk, sel hewan bisa lisis\n- **Hipertonik** (lebih pekat) → air keluar, sel mengerut\n- **Isotonik** → seimbang' },
        { k: ['difusi', 'transpor aktif', 'transport'], a: '**Difusi**: tinggi → rendah, tanpa energi. **Transpor aktif**: rendah → tinggi, butuh protein pembawa + **ATP**. Contoh transpor aktif: pompa Na⁺/K⁺.' },
        { k: ['mitokondria', 'ribosom', 'lisosom', 'golgi', 'organel', 'nukleus', 'sel'], a: '**Organel penting**:\n- Nukleus: pusat kendali (DNA)\n- Mitokondria: penghasil ATP\n- Ribosom: sintesis protein\n- Badan Golgi: pengemasan\n- Lisosom: pencernaan sel\n- Kloroplas: fotosintesis (tumbuhan)' },
        { k: ['fotosintesis'], a: '**Fotosintesis**: 6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂, terjadi di kloroplas (klorofil menangkap cahaya).' }
    ];

    let history = [];
    let busy = false;

    const cfg = () => { try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch (e) { return {}; } };
    const saveCfg = c => localStorage.setItem(CFG_KEY, JSON.stringify(c));

    function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    function md(t) {
        return esc(t)
            .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.+?)\*/g, '<i>$1</i>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/^- (.*)$/gm, '• $1')
            .replace(/\n/g, '<br>');
    }

    function offlineAnswer(q) {
        const s = ' ' + q.toLowerCase() + ' ';
        let best = null, score = 0;
        KB.forEach(e => {
            const sc = e.k.reduce((n, kw) => n + (s.includes(kw) ? kw.length : 0), 0);
            if (sc > score) { score = sc; best = e; }
        });
        if (best) return best.a + '\n\n_(Mode offline. Pasang API key Gemini lewat ⚙️ agar bisa menjawab pertanyaan apa pun.)_';
        return 'Hmm, pertanyaan itu belum ada di basis pengetahuan offline-ku 🤔.\nAku bisa bantu: **Hukum Newton, Fungsi Kuadrat, Struktur Atom, Sel & Transpor**.\n\nUntuk jawaban bebas, aktifkan mode AI penuh lewat tombol ⚙️ (API key Gemini).';
    }

    async function onlineAnswer(c) {
        const model = c.model || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(c.apiKey)}`;
        const contents = history.slice(-10).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents })
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(res.status + ' ' + err.slice(0, 150));
        }
        const data = await res.json();
        const txt = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('');
        if (!txt) throw new Error('Respons kosong');
        return txt;
    }

    // ---- status server AI (proxy di backend) ----
    let serverAI = null;   // null = belum dicek, true/false = hasil cek

    async function checkServer() {
        try {
            const r = await fetch('/api/health', { signal: AbortSignal.timeout(4000) });
            serverAI = !!(await r.json()).ai;
        } catch (e) { serverAI = false; }
        updateMode();
    }

    function updateMode() {
        const el = document.getElementById('ai-mode');
        if (!el) return;
        const full = serverAI || cfg().apiKey;
        el.className = 'ai-mode ' + (full ? 'online' : '');
        el.textContent = serverAI ? '🟢 AI penuh aktif' : cfg().apiKey ? '🟢 AI penuh (key pribadi)' : '🟡 Mode offline — topik terbatas';
    }

    async function getAnswer(c, text) {
        if (serverAI !== false) {
            try {
                const res = await fetch('/api/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: history.slice(-10), track: App.getState().track }),
                    signal: AbortSignal.timeout(30000)
                });
                const d = await res.json().catch(() => ({}));
                if (res.ok && d.text) { serverAI = true; return d.text; }
                if (res.status === 429) return '⏳ ' + d.error;
                if (res.status === 503) serverAI = false;
            } catch (e) { /* lanjut ke cadangan */ }
        }
        if (c.apiKey) return await onlineAnswer(c);
        return offlineAnswer(text);
    }

    async function send(text) {
        text = (text || '').trim();
        if (!text || busy) return;
        busy = true;
        history.push({ role: 'user', text });
        renderMessages(true);
        const c = cfg();
        let answer;
        try {
            answer = await getAnswer(c, text);
        } catch (e) {
            answer = offlineAnswer(text) + '\n\n⚠️ Gagal terhubung ke AI online (' + e.message + '). Cek API key / koneksi di ⚙️.';
        }
        history.push({ role: 'ai', text: answer });
        busy = false;
        App.addXP(5, true);
        renderMessages(false);
    }

    function renderMessages(typing) {
        const box = document.getElementById('ai-messages');
        if (!box) return;
        box.innerHTML = history.map(m => `
            <div class="chat-row ${m.role}">
                ${m.role === 'ai' ? '<div class="chat-avatar">🤖</div>' : ''}
                <div class="chat-bubble">${md(m.text)}</div>
            </div>`).join('') + (typing ? `
            <div class="chat-row ai"><div class="chat-avatar">🤖</div><div class="chat-bubble typing"><span></span><span></span><span></span></div></div>` : '');
        box.scrollTop = box.scrollHeight;
    }

    function render() {
        const page = document.getElementById('page-ai');
        const c = cfg();
        page.innerHTML = `
            <div class="ai-head">
                <div>
                    <h2 class="section-title" style="margin:0;">🤖 AI Tutor "Pintar"</h2>
                    <p class="section-subtitle" style="margin:4px 0 0;">Tanya apa saja soal pelajaran SMA — tanpa malu, tanpa dihakimi.</p>
                </div>
                <button class="btn-icon" title="Pengaturan AI" onclick="AITutor.settings()">⚙️</button>
            </div>
            <div class="ai-mode" id="ai-mode"></div>
            <div class="chat-box">
                <div id="ai-messages" class="chat-messages"></div>
                <div class="chat-chips">
                    ${['Jelasin Hukum II Newton', 'Apa itu diskriminan?', 'Cara cari elektron valensi', 'Bedanya difusi & osmosis'].map(s =>
                        `<span class="chip" onclick="AITutor.send('${s}')">${s}</span>`).join('')}
                </div>
                <form class="chat-input" onsubmit="event.preventDefault(); AITutor.submit();">
                    <input id="ai-input" class="input-field" placeholder="Ketik pertanyaanmu di sini..." autocomplete="off">
                    <button class="btn btn-primary" type="submit">Kirim ➤</button>
                </form>
            </div>`;
        updateMode();
        if (serverAI === null) checkServer();
        if (history.length === 0) {
            history.push({ role: 'ai', text: 'Halo! Aku **Pintar** 👋, tutor AI-mu. Bingung soal Fisika, Matematika, Kimia, atau Biologi? Tanya aja, nggak ada pertanyaan yang bodoh! 🎓' });
        }
        renderMessages(false);
    }

    function submit() {
        const i = document.getElementById('ai-input');
        const v = i.value;
        i.value = '';
        send(v);
    }

    function askAbout(topic) {
        App.navigate('ai');
        send('Tolong jelaskan dengan sederhana: ' + topic);
    }

    function settings() {
        const c = cfg();
        App.showModal(`
            <h2>⚙️ Pengaturan AI</h2>
            <p style="font-size:13px;text-align:left;">Masukkan <b>API key Google Gemini</b> (gratis di aistudio.google.com) untuk mengaktifkan AI yang bisa menjawab pertanyaan apa pun.</p>
            <div class="input-group" style="text-align:left;margin-top:12px;">
                <label>API Key</label>
                <input id="ai-key" type="password" class="input-field" placeholder="AIza..." value="${esc(c.apiKey || '')}">
            </div>
            <div class="input-group" style="text-align:left;">
                <label>Model</label>
                <input id="ai-model" class="input-field" value="${esc(c.model || 'gemini-2.5-flash')}">
            </div>
            <p style="font-size:11px;color:var(--text-muted);text-align:left;">Key hanya disimpan di browser ini. Untuk dipakai banyak siswa, sebaiknya key disimpan di server (backend proxy) agar tidak terlihat.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;">
                <button class="btn btn-secondary" onclick="AITutor.clearKey()">Hapus Key</button>
                <button class="btn btn-primary" onclick="AITutor.saveSettings()">Simpan</button>
            </div>`);
    }
    function saveSettings() {
        saveCfg({ apiKey: document.getElementById('ai-key').value.trim(), model: document.getElementById('ai-model').value.trim() || 'gemini-2.5-flash' });
        App.closeModal(); App.showToast('✅ Pengaturan AI disimpan'); render();
    }
    function clearKey() { saveCfg({}); App.closeModal(); App.showToast('Key dihapus'); render(); }

    return { render, send, submit, askAbout, settings, saveSettings, clearKey };
})();

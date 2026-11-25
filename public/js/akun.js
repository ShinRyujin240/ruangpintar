/* ============================================================
   RuangPintar — akun.js
   Daftar akun dengan scan kartu pelajar (OCR di perangkat).
   - OCR pakai Tesseract.js (dimuat dari CDN hanya saat dibutuhkan)
   - Foto TIDAK diunggah ke server; yang disimpan cuma data teks
   - Hasil scan selalu bisa dicek & dikoreksi sebelum disimpan
   ============================================================ */

const Akun = (() => {

    const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    const SKIP_KEY = 'rp_skip_auth';
    const FIELDS = ['nama', 'nisn', 'nis', 'sekolah', 'kelas', 'ttl', 'jk'];

    let draft = null;        // data yang sedang dicek
    let previewUrl = null;   // object URL foto kartu (hanya di memori)
    let via = 'manual';      // 'scan' | 'manual'
    let editing = false;     // edit dari profil
    let rawText = '';

    const I = {
        camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
        image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
        lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
        back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
        card: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h5M14 13.5h3.5"/></svg>'
    };

    // ---------- util ----------
    const $ = id => document.getElementById(id);
    function esc(t) {
        return String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    function emptyDraft() {
        return { nama: '', panggilan: '', nisn: '', nis: '', sekolah: '', kelas: '', ttl: '', jk: '', track: '' };
    }
    function has() {
        const s = App.getState();
        return !!(s.account && s.account.nama);
    }
    function skipped() {
        try { return sessionStorage.getItem(SKIP_KEY) === '1'; } catch (e) { return false; }
    }

    // ---------- buka / tutup layar akun ----------
    function open() {
        editing = false;
        draft = null;
        $('auth-screen').classList.remove('hidden');
        document.body.classList.add('auth-open');
        renderStart();
    }
    function close() {
        $('auth-screen').classList.add('hidden');
        document.body.classList.remove('auth-open');
        if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    }
    function skip() {
        try { sessionStorage.setItem(SKIP_KEY, '1'); } catch (e) {}
        close();
        if (!App.getState().track) App.showOnboarding();
    }

    // ---------- tampilan 1: pilih cara daftar ----------
    function renderStart() {
        $('auth-screen').innerHTML = `
            <div class="auth-wrap">
                <div class="auth-brand">
                    <svg class="logo-mark" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#8B5CF6"/><path d="M10 23V9h6.5a4.5 4.5 0 0 1 0 9H10m7 0 5.5 5" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>RuangPintar</span>
                </div>

                <h1 class="auth-title">Bikin akun dulu, sebentar aja.</h1>
                <p class="auth-sub">Foto kartu pelajarmu. Nama, NISN, kelas, dan sekolah bakal keisi sendiri, nanti tinggal kamu cek.</p>

                <div class="kp-illus" aria-hidden="true">
                    <div class="kp-illus-card">
                        <div class="kp-l1"></div><div class="kp-l2"></div>
                        <div class="kp-row"><div class="kp-photo"></div><div class="kp-lines"><i></i><i></i><i></i><i></i></div></div>
                    </div>
                    <div class="kp-scanline"></div>
                </div>

                <div class="auth-actions">
                    <label class="btn-auth primary" for="kp-camera">${I.camera}<span>Foto kartu pelajar</span></label>
                    <label class="btn-auth" for="kp-gallery">${I.image}<span>Pilih dari galeri</span></label>
                </div>
                <input type="file" id="kp-camera" accept="image/*" capture="environment" hidden onchange="Akun.onFile(this)">
                <input type="file" id="kp-gallery" accept="image/*" hidden onchange="Akun.onFile(this)">

                <ul class="auth-tips">
                    <li>Taruh kartu di tempat terang, jangan kena pantulan lampu.</li>
                    <li>Foto lurus dari atas, kartu memenuhi layar.</li>
                </ul>

                <button class="auth-link" onclick="Akun.manual()">Isi manual aja</button>

                <p class="auth-privacy">${I.lock}<span>Foto kartu dibaca langsung di perangkatmu dan tidak dikirim ke server. Yang disimpan cuma data teksnya, di browser ini.</span></p>

                <button class="auth-skip" onclick="Akun.skip()">Lewati dulu</button>
            </div>`;
    }

    // ---------- tampilan 2: proses scan ----------
    function renderScanning(label, pct) {
        $('auth-screen').innerHTML = `
            <div class="auth-wrap">
                <h1 class="auth-title">Lagi baca kartumu...</h1>
                <p class="auth-sub">Pertama kali bisa agak lama (10–30 detik) karena mesin pembacanya perlu diunduh.</p>
                <div class="scan-stage">
                    ${previewUrl ? `<img src="${previewUrl}" alt="Foto kartu pelajar">` : ''}
                    <div class="scan-beam"></div>
                </div>
                <div class="scan-status"><span id="scan-label">${esc(label)}</span><span id="scan-pct">${pct}%</span></div>
                <div class="progress-bar"><div class="progress-fill" id="scan-fill" style="width:${pct}%"></div></div>
            </div>`;
    }
    function setProgress(label, pct) {
        const l = $('scan-label'), p = $('scan-pct'), f = $('scan-fill');
        if (l) l.textContent = label;
        if (p) p.textContent = pct + '%';
        if (f) f.style.width = pct + '%';
    }

    async function onFile(input) {
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        if (!/^image\//.test(file.type)) { App.showToast('File harus berupa gambar'); return; }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(file);
        via = 'scan';
        renderScanning('Menyiapkan foto', 0);

        try {
            rawText = await recognize(setProgress);
            draft = parseCard(rawText);
        } catch (err) {
            console.warn('OCR gagal:', err);
            rawText = '';
            draft = emptyDraft();
            App.showToast('Kartunya belum kebaca. Isi manual dulu ya.', 3500);
        }
        renderReview();
    }

    // ---------- OCR ----------
    function loadTesseract() {
        if (window.Tesseract) return Promise.resolve(window.Tesseract);
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = TESSERACT_URL;
            s.onload = () => resolve(window.Tesseract);
            s.onerror = () => reject(new Error('Gagal memuat mesin OCR (cek koneksi internet)'));
            document.head.appendChild(s);
        });
    }

    // perbesar/perkecil, grayscale, dan naikkan kontras biar teks lebih tajam
    function prepareImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const longSide = Math.max(img.naturalWidth, img.naturalHeight);
                const scale = longSide > 2000 ? 2000 / longSide : longSide < 1200 ? 1200 / longSide : 1;
                const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const data = ctx.getImageData(0, 0, w, h);
                const px = data.data;
                let min = 255, max = 0;
                for (let i = 0; i < px.length; i += 4) {
                    const g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
                    px[i] = g;
                    if (g < min) min = g;
                    if (g > max) max = g;
                }
                const range = Math.max(1, max - min);
                for (let i = 0; i < px.length; i += 4) {
                    const v = ((px[i] - min) / range) * 255;
                    px[i] = px[i + 1] = px[i + 2] = v;
                }
                ctx.putImageData(data, 0, 0);
                resolve(c);
            };
            img.onerror = () => reject(new Error('Gambar tidak bisa dibuka'));
            img.src = previewUrl;
        });
    }

    async function recognize(onProgress) {
        const STATUS = {
            'loading tesseract core': ['Mengunduh mesin pembaca', 10],
            'initializing tesseract': ['Menyiapkan mesin pembaca', 20],
            'loading language traineddata': ['Mengunduh kamus bahasa', 30],
            'initializing api': ['Hampir siap', 40],
            'recognizing text': ['Membaca tulisan di kartu', 45]
        };
        onProgress('Menyiapkan foto', 5);
        const canvas = await prepareImage();
        const T = await loadTesseract();
        const worker = await T.createWorker('ind+eng', 1, {
            logger: m => {
                const st = STATUS[m.status];
                if (!st) return;
                const pct = m.status === 'recognizing text'
                    ? Math.round(45 + (m.progress || 0) * 55)
                    : st[1];
                onProgress(st[0], Math.min(99, pct));
            }
        });
        try {
            const { data } = await worker.recognize(canvas);
            onProgress('Selesai', 100);
            return data.text || '';
        } finally {
            await worker.terminate();
        }
    }

    // ---------- PARSER teks kartu pelajar ----------
    // OCR sering salah baca angka: O→0, I/l/|→1, S→5, B→8, Z→2
    function fixDigits(s) {
        return String(s).replace(/[Oo]/g, '0').replace(/[Il|!]/g, '1').replace(/S/g, '5').replace(/B/g, '8').replace(/Z/g, '2').replace(/[^\d]/g, '');
    }
    function titleCase(s) {
        return s.toLowerCase().replace(/(^|[\s\-'.])([a-z])/g, (m, a, b) => a + b.toUpperCase());
    }
    function cleanValue(s) {
        return String(s || '')
            .replace(/^[\s:;=.,\-_|>]+/, '')
            .replace(/[|_~*"“”]+/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function parseCard(text) {
        const d = emptyDraft();
        const lines = String(text || '').split(/\r?\n/).map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
        const all = lines.join('\n');

        // ambil nilai setelah label; exclude = kata yang bikin baris itu bukan yang dicari
        const pick = (re, exclude) => {
            for (const l of lines) {
                if (exclude && exclude.test(l)) continue;
                const m = l.match(re);
                if (m && cleanValue(m[1])) return cleanValue(m[1]);
            }
            return '';
        };

        // NIS / NISN (kadang digabung: "NIS/NISN : 1234/0051234567")
        const combo = pick(/n\s*[i1l]\s*s\s*\/\s*n\s*[i1l]\s*s\s*n\s*[:;.]?\s*(.+)$/i);
        if (combo && combo.includes('/')) {
            const [a, b] = combo.split('/');
            d.nis = fixDigits(a);
            d.nisn = fixDigits(b);
        }
        if (!d.nisn) {
            const v = pick(/n\s*[i1l]\s*s\s*n\b\s*[:;.]?\s*([0-9OoIlSBZ|\s.\-]{6,})/i);
            if (v) d.nisn = fixDigits(v);
        }
        if (!d.nisn) {
            // cadangan: cari deretan 10 digit di mana saja
            const m = all.replace(/(\d)[ .\-](?=\d)/g, '$1').match(/\b\d{10}\b/);
            if (m) d.nisn = m[0];
        }
        if (d.nisn.length > 10) d.nisn = d.nisn.slice(0, 10);
        if (!d.nis) {
            const v = pick(/(?:^|\s)n\s*[i1l]\s*s\b(?!\s*n)\s*[:;.]?\s*([0-9OoIlSBZ|\s.\-\/]{3,})/i, /nisn/i);
            if (v) d.nis = fixDigits(v.split('/')[0]);
        }

        // Nama (hindari "Nama Sekolah", "Nama Ayah", dll)
        let nama = pick(/^nama(?:\s*(?:lengkap|siswa|pelajar|peserta\s*didik))?\s*[:;=.\-]?\s*(.+)$/i,
            /sekolah|ayah|ibu|orang\s*tua|wali|kepala/i);
        nama = nama.replace(/[^A-Za-z.'\-\s,]/g, '').replace(/\s{2,}/g, ' ').trim();
        if (nama) d.nama = titleCase(nama);

        // Tempat, tanggal lahir
        d.ttl = pick(/(?:tempat|tmp|t4|ttl)[^:;]*?(?:lahir)?\s*[:;=]\s*(.+)$/i)
             || pick(/(?:tempat|tmp|ttl)\s*[,\/]?\s*(?:tgl|tanggal)?\.?\s*lahir\s*(.+)$/i);
        if (d.ttl) d.ttl = d.ttl.replace(/^(\w)(\w*)/, (m, a, b) => a.toUpperCase() + b.toLowerCase());

        // Jenis kelamin
        const jk = pick(/(?:jenis\s*kelamin|j\.?\s*kelamin|kelamin|gender|l\s*\/\s*p)\s*[:;=]?\s*(.+)$/i) || '';
        if (/laki|pria|^l\b/i.test(jk)) d.jk = 'Laki-laki';
        else if (/perempuan|wanita|^p\b/i.test(jk)) d.jk = 'Perempuan';

        // Kelas
        d.kelas = pick(/^kelas\s*[:;=.]?\s*(.+)$/i, /kelamin/i).toUpperCase();
        if (!d.kelas) {
            const m = all.match(/\b(XII|XI|X|10|11|12)\s*[-.]?\s*(MIPA|IPA|IPS|IIS|BAHASA)\s*[-.]?\s*(\d{1,2})?\b/i);
            if (m) d.kelas = m[0].toUpperCase().replace(/\s+/g, ' ');
        }

        // Sekolah: label dulu, kalau tidak ada cari baris berisi SMA/SMK/MA
        let sekolah = pick(/^(?:nama\s*)?sekolah\s*[:;=.]?\s*(.+)$/i)
            || pick(/((?:SMA|SMK|MAN?|SMAN|SMKN|SMA\s*IT)\b.*)$/i, /kartu|pelajar\b.*kartu/i);
        sekolah = sekolah.replace(/[^A-Za-z0-9.\-\s]/g, '').replace(/\s{2,}/g, ' ').trim();
        if (sekolah) d.sekolah = sekolah.toUpperCase();

        // Jurusan dari teks
        const jur = (pick(/(?:jurusan|peminatan|program)\s*[:;=.]?\s*(.+)$/i) + ' ' + d.kelas + ' ' + all);
        if (/\b(IPS|IIS|SOSIAL)\b/i.test(jur)) d.track = 'ips';
        else if (/\b(MIPA|IPA|SAINS)\b/i.test(jur)) d.track = 'ipa';

        d.panggilan = d.nama ? d.nama.split(' ')[0] : '';
        return d;
    }

    // ---------- tampilan 3: cek & koreksi ----------
    function manual() {
        via = 'manual';
        rawText = '';
        draft = emptyDraft();
        if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
        renderReview();
    }

    function edit() {
        const acc = App.getState().account || {};
        editing = true;
        via = 'manual';
        rawText = '';
        draft = { ...emptyDraft(), ...acc, track: App.getState().track || acc.track || '' };
        $('auth-screen').classList.remove('hidden');
        document.body.classList.add('auth-open');
        renderReview();
    }

    function back() {
        if (editing) { close(); return; }
        renderStart();
    }

    function renderReview() {
        const d = draft || emptyDraft();
        const found = FIELDS.filter(f => d[f]).length;
        const scanned = via === 'scan';
        const miss = f => scanned && !d[f] ? 'is-missing' : '';

        let sub;
        if (editing) sub = 'Ubah data yang perlu diperbaiki.';
        else if (scanned && found === 0) sub = 'Tulisannya belum kebaca. Coba foto ulang di tempat lebih terang, atau isi manual di bawah.';
        else if (scanned) sub = `Kebaca ${found} dari ${FIELDS.length} data. Yang kosong atau salah langsung ketik ulang aja.`;
        else sub = 'Isi sesuai yang tertulis di kartu pelajarmu.';

        $('auth-screen').innerHTML = `
            <div class="auth-wrap wide">
                <button class="auth-back" onclick="Akun.back()">${I.back}<span>${editing ? 'Batal' : 'Kembali'}</span></button>
                <h1 class="auth-title">${editing ? 'Ubah data akun' : 'Cek lagi datanya'}</h1>
                <p class="auth-sub">${sub}</p>

                ${previewUrl ? `<img class="kp-preview" src="${previewUrl}" alt="Foto kartu pelajar">` : ''}

                <form class="acc-form" onsubmit="event.preventDefault(); Akun.save();">
                    <div class="acc-field full ${miss('nama')}">
                        <label for="f-nama">Nama lengkap</label>
                        <input id="f-nama" class="input-field" value="${esc(d.nama)}" maxlength="60" autocomplete="name" placeholder="Sesuai kartu pelajar">
                    </div>
                    <div class="acc-field">
                        <label for="f-panggilan">Nama panggilan <em>opsional</em></label>
                        <input id="f-panggilan" class="input-field" value="${esc(d.panggilan)}" maxlength="20" placeholder="Biar sapaannya enak">
                    </div>
                    <div class="acc-field ${miss('nisn')}">
                        <label for="f-nisn">NISN</label>
                        <input id="f-nisn" class="input-field mono" value="${esc(d.nisn)}" maxlength="10" inputmode="numeric" placeholder="10 digit">
                    </div>
                    <div class="acc-field ${miss('nis')}">
                        <label for="f-nis">NIS <em>opsional</em></label>
                        <input id="f-nis" class="input-field mono" value="${esc(d.nis)}" maxlength="12" inputmode="numeric">
                    </div>
                    <div class="acc-field ${miss('kelas')}">
                        <label for="f-kelas">Kelas</label>
                        <input id="f-kelas" class="input-field" value="${esc(d.kelas)}" maxlength="20" placeholder="Contoh: XI IPA 2">
                    </div>
                    <div class="acc-field full ${miss('sekolah')}">
                        <label for="f-sekolah">Sekolah</label>
                        <input id="f-sekolah" class="input-field" value="${esc(d.sekolah)}" maxlength="80" placeholder="Contoh: SMA Negeri 1 Bandung">
                    </div>
                    <div class="acc-field ${miss('ttl')}">
                        <label for="f-ttl">Tempat, tanggal lahir <em>opsional</em></label>
                        <input id="f-ttl" class="input-field" value="${esc(d.ttl)}" maxlength="60" placeholder="Bandung, 12-05-2008">
                    </div>
                    <div class="acc-field ${miss('jk')}">
                        <label for="f-jk">Jenis kelamin <em>opsional</em></label>
                        <select id="f-jk" class="input-field">
                            <option value="">Pilih</option>
                            <option ${d.jk === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                            <option ${d.jk === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="acc-field full">
                        <label>Jurusan</label>
                        <div class="seg">
                            <button type="button" class="seg-btn ${d.track === 'ipa' ? 'on' : ''}" onclick="Akun.setTrack('ipa', this)">IPA</button>
                            <button type="button" class="seg-btn ${d.track === 'ips' ? 'on' : ''}" onclick="Akun.setTrack('ips', this)">IPS</button>
                        </div>
                    </div>

                    <p class="acc-error" id="acc-error"></p>
                    <button type="submit" class="btn btn-primary btn-full btn-lg">${editing ? 'Simpan perubahan' : 'Simpan & mulai belajar'}</button>
                    ${scanned && !editing ? '<button type="button" class="auth-link" onclick="Akun.retake()">Foto ulang kartu</button>' : ''}
                </form>

                ${rawText ? `<details class="raw-ocr"><summary>Lihat teks hasil scan</summary><pre>${esc(rawText)}</pre></details>` : ''}
            </div>`;
        $('auth-screen').scrollTop = 0;
    }

    function setTrack(t, btn) {
        draft.track = t;
        btn.parentElement.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('on', b === btn));
    }

    function retake() {
        renderStart();
    }

    function save() {
        const v = id => ($('f-' + id)?.value || '').trim();
        const data = {
            nama: v('nama').replace(/\s{2,}/g, ' '),
            panggilan: v('panggilan'),
            nisn: v('nisn').replace(/\D/g, ''),
            nis: v('nis').replace(/\D/g, ''),
            kelas: v('kelas').toUpperCase(),
            sekolah: v('sekolah'),
            ttl: v('ttl'),
            jk: v('jk'),
            track: draft.track
        };
        const err = msg => { const e = $('acc-error'); e.textContent = msg; e.scrollIntoView?.({ block: 'center', behavior: 'smooth' }); };

        if (data.nama.length < 3) return err('Nama lengkapnya diisi dulu ya.');
        if (data.nisn.length !== 10) return err('NISN harus 10 digit angka. Cek lagi di kartumu.');
        if (!data.track) return err('Pilih jurusan IPA atau IPS.');

        const prev = App.getState().account || {};
        const account = {
            nama: data.nama, nisn: data.nisn, nis: data.nis, kelas: data.kelas, sekolah: data.sekolah,
            ttl: data.ttl, jk: data.jk, panggilan: data.panggilan,
            via: editing ? (prev.via || 'manual') : via,
            createdAt: prev.createdAt || new Date().toISOString()
        };
        App.setState({
            account,
            track: data.track,
            studentName: data.panggilan || data.nama.split(' ')[0]
        });
        const wasEditing = editing;
        editing = false;
        close();
        App.navigate(wasEditing ? 'profil' : 'beranda');
        App.showToast(wasEditing ? 'Data akun diperbarui' : `Akun dibuat. Halo, ${App.getState().studentName}!`);
    }

    // ---------- kartu digital (dipakai di Profil) ----------
    function maskNisn(n) {
        if (!n) return '-';
        return n.slice(0, 4) + '••••' + n.slice(-2);
    }
    function initials(nama) {
        return nama.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    }
    function toggleNisn(el) {
        const acc = App.getState().account;
        if (!acc) return;
        const shown = el.dataset.shown === '1';
        el.textContent = shown ? maskNisn(acc.nisn) : acc.nisn;
        el.dataset.shown = shown ? '0' : '1';
    }

    function cardHtml() {
        const s = App.getState();
        const a = s.account;
        if (!a) {
            return `
                <div class="id-card empty">
                    <div class="idc-empty-icon">${I.card}</div>
                    <div>
                        <div class="idc-empty-title">Belum punya akun</div>
                        <div class="idc-empty-sub">Daftar pakai kartu pelajar biar progresmu tercatat atas namamu.</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="Akun.open()">Daftar</button>
                </div>`;
        }
        const level = Math.floor((s.xp || 0) / 100) + 1;
        return `
            <div class="id-card">
                <div class="idc-top">
                    <span class="idc-school">${esc(a.sekolah || 'Sekolah belum diisi')}</span>
                    <span class="idc-tag">Kartu Pelajar</span>
                </div>
                <div class="idc-body">
                    <div class="idc-avatar">${esc(initials(a.nama))}</div>
                    <div class="idc-id">
                        <div class="idc-name">${esc(a.nama)}</div>
                        <div class="idc-meta">${esc([a.kelas, s.track ? s.track.toUpperCase() : ''].filter(Boolean).join(' · ') || '-')}</div>
                    </div>
                    <div class="idc-level"><b>${level}</b><span>Level</span></div>
                </div>
                <dl class="idc-grid">
                    <div><dt>NISN</dt><dd class="mono"><button class="idc-nisn" data-shown="0" onclick="Akun.toggleNisn(this)" title="Ketuk untuk lihat">${maskNisn(a.nisn)}</button></dd></div>
                    <div><dt>NIS</dt><dd class="mono">${esc(a.nis || '-')}</dd></div>
                    <div><dt>Tempat, tgl lahir</dt><dd>${esc(a.ttl || '-')}</dd></div>
                    <div><dt>Jenis kelamin</dt><dd>${esc(a.jk || '-')}</dd></div>
                </dl>
                <div class="idc-foot">
                    <span>${a.via === 'scan' ? 'Didaftarkan lewat scan kartu' : 'Didaftarkan manual'}</span>
                    <span>sejak ${new Date(a.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
            <div class="idc-actions">
                <button class="btn btn-sm btn-outline" onclick="Akun.edit()">Ubah data</button>
                <button class="btn btn-sm btn-secondary" onclick="Akun.confirmRemove()">Keluar akun</button>
            </div>`;
    }

    function confirmRemove() {
        App.showModal(`
            <h2>Keluar dari akun?</h2>
            <p>Data kartu pelajar (nama, NISN, dll) dihapus dari perangkat ini. Progres belajar dan XP tetap ada.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="Akun.remove()">Ya, keluar</button>
            </div>`);
    }
    function remove() {
        App.setState({ account: null, studentName: 'Siswa Pintar' });
        App.closeModal();
        App.showToast('Kamu sudah keluar dari akun');
        open();
    }

    return {
        has, skipped, open, close, skip, manual, edit, back, retake,
        onFile, setTrack, save, parseCard, cardHtml, toggleNisn, confirmRemove, remove
    };
})();

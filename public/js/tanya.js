/* ============================================================
   RuangPintar — tanya.js
   Forum tanya-jawab ANONIM bersama (tersambung ke backend /api).
   Jika backend tidak tersedia (mis. file dibuka langsung), otomatis
   memakai penyimpanan lokal di browser.
   ============================================================ */

const Tanya = (() => {

    const CATEGORIES = [
        { id: 'semua', label: 'Semua', icon: '📋' },
        { id: 'materi', label: 'Materi Pelajaran', icon: '📖' },
        { id: 'tugas', label: 'Tugas / PR', icon: '📝' },
        { id: 'ujian', label: 'Ujian / Ulangan', icon: '📄' },
        { id: 'umum', label: 'Umum', icon: '💬' }
    ];

    const LOCAL_KEY = 'ruangpintar_forum_local';
    const VOTER_KEY = 'ruangpintar_voter';
    const TEACHER_KEY = 'ruangpintar_teacher';

    let questions = [];
    let online = true;
    let loading = true;
    let currentSort = 'newest';
    let currentCategory = 'semua';

    // id anonim acak per perangkat (hanya untuk mencegah vote ganda)
    function voterId() {
        let v = localStorage.getItem(VOTER_KEY);
        if (!v) { v = 'v' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(VOTER_KEY, v); }
        return v;
    }
    const teacherKey = () => localStorage.getItem(TEACHER_KEY) || '';

    async function api(path, opts = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (teacherKey()) headers['x-teacher-key'] = teacherKey();
        const res = await fetch('/api' + path, { ...opts, headers, signal: AbortSignal.timeout(8000) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { const e = new Error(data.error || 'Gagal'); e.status = res.status; throw e; }
        return data;
    }

    // ---------- penyimpanan lokal (cadangan) ----------
    function localLoad() {
        try {
            const s = JSON.parse(localStorage.getItem(LOCAL_KEY));
            if (s) return s;
        } catch (e) { /* abaikan */ }
        const seeded = (window.SEED_SMA || []).map(q => ({
            id: q.id, text: q.text, category: q.category, timestamp: q.timestamp,
            upvotes: q.upvotes || 0, votedByMe: false, answers: q.answer ? [q.answer] : []
        }));
        localStorage.setItem(LOCAL_KEY, JSON.stringify(seeded));
        return seeded;
    }
    const localSave = () => localStorage.setItem(LOCAL_KEY, JSON.stringify(questions));

    // ---------- muat data ----------
    async function load() {
        loading = true;
        try {
            const d = await api('/questions?voter=' + encodeURIComponent(voterId()));
            questions = d.questions;
            online = true;
        } catch (e) {
            online = false;
            questions = localLoad();
        }
        loading = false;
        render();
    }

    // ---------- render ----------
    function render() {
        const page = document.getElementById('page-tanya');
        if (!page) return;

        let list = currentCategory === 'semua' ? questions : questions.filter(q => q.category === currentCategory);
        list = [...list].sort(currentSort === 'popular'
            ? (a, b) => b.upvotes - a.upvotes
            : (a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const teacher = !!teacherKey();

        page.innerHTML = `
            <div class="tanya-header">
                <h2 class="section-title" style="margin-top:0;">💬 Tanya Bebas</h2>
                <div class="th-anon-badge">🔒 100% Anonim — tidak ada nama, tidak ada yang tahu siapa yang bertanya!</div>
                <p class="section-subtitle">Forum bersama satu sekolah: tanya apa saja tanpa malu. Teman &amp; guru bisa menjawab.</p>
                <div class="ai-mode ${online ? 'online' : ''}">${online ? '🟢 Terhubung ke forum bersama' : '🟡 Mode lokal (server tidak terhubung) — pertanyaan hanya tersimpan di perangkat ini'}</div>
            </div>

            <div class="ask-box">
                <div class="ab-title">✍️ Ajukan Pertanyaan Baru</div>
                <textarea id="tanya-input" class="textarea-field" maxlength="500" placeholder="Tulis pertanyaanmu di sini... (anonim, tidak perlu khawatir! 😊)" rows="3"></textarea>
                <div class="ab-actions">
                    <select id="tanya-category">
                        ${CATEGORIES.filter(c => c.id !== 'semua').map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('')}
                    </select>
                    <button class="btn btn-primary btn-sm" onclick="Tanya.submitQuestion()">📨 Kirim Pertanyaan</button>
                </div>
            </div>

            <div class="question-filters">
                <div class="qf-count">${loading ? 'Memuat…' : list.length + ' pertanyaan'}</div>
                <div class="qf-sort">
                    <button class="${currentSort === 'newest' ? 'active' : ''}" onclick="Tanya.setSort('newest')">🕐 Terbaru</button>
                    <button class="${currentSort === 'popular' ? 'active' : ''}" onclick="Tanya.setSort('popular')">🔥 Populer</button>
                    <button onclick="Tanya.load()" title="Muat ulang">🔄</button>
                </div>
            </div>

            <div class="chip-group">
                ${CATEGORIES.map(c => `<span class="chip ${currentCategory === c.id ? 'active' : ''}" onclick="Tanya.setCategory('${c.id}')">${c.icon} ${c.label}</span>`).join('')}
            </div>

            <div class="question-list">
                ${loading ? '<div class="empty-state"><span class="es-icon">⏳</span><span class="es-text">Memuat pertanyaan…</span></div>'
                : list.length === 0 ? `<div class="empty-state"><span class="es-icon">🤔</span><span class="es-text">Belum ada pertanyaan di kategori ini.<br>Jadilah yang pertama bertanya!</span></div>`
                : list.map(q => renderItem(q, teacher)).join('')}
            </div>

            <div style="text-align:center;margin-top:24px;">
                <button class="btn btn-sm btn-secondary" onclick="Tanya.teacherLogin()">${teacher ? '🧑‍🏫 Mode Guru aktif (klik untuk keluar)' : '🧑‍🏫 Saya guru'}</button>
            </div>`;
    }

    function renderItem(q, teacher) {
        const cat = CATEGORIES.find(c => c.id === q.category) || CATEGORIES[4];
        return `
            <div class="question-item">
                <div class="qi-header">
                    <span class="qi-category badge badge-primary">${cat.icon} ${cat.label}</span>
                    <span class="qi-time">${App.formatDate(q.timestamp)}</span>
                </div>
                <div class="qi-text">${esc(q.text)}</div>
                <div class="qi-footer">
                    <button class="qi-upvote ${q.votedByMe ? 'upvoted' : ''}" onclick="Tanya.vote('${q.id}')">
                        <span>${q.votedByMe ? '💜' : '👍'}</span><span>${q.upvotes}</span>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="Tanya.showAnswerForm('${q.id}')">💡 Jawab</button>
                    ${teacher ? `<button class="btn btn-sm btn-secondary" onclick="Tanya.remove('${q.id}')">🗑️</button>` : ''}
                </div>
                ${q.answers.map(a => `
                    <div class="qi-answer" ${a.isTeacher ? 'style="border-left-color:#6C5CE7;background:rgba(108,92,231,.08)"' : ''}>
                        <div class="qa-label">${a.isTeacher ? '🧑‍🏫 Jawaban Guru' : '✅ Jawaban Teman'} · ${App.formatDate(a.timestamp)}</div>
                        <div class="qa-text">${esc(a.text)}</div>
                    </div>`).join('')}
            </div>`;
    }

    function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

    // ---------- aksi ----------
    async function submitQuestion() {
        const input = document.getElementById('tanya-input');
        const text = input.value.trim();
        const category = document.getElementById('tanya-category').value;
        if (!text) { App.showToast('⚠️ Tulis pertanyaanmu dulu ya!'); input.focus(); return; }
        if (text.length < 10) { App.showToast('⚠️ Pertanyaan terlalu pendek. Coba lebih detail.'); input.focus(); return; }
        try {
            if (online) {
                const d = await api('/questions', { method: 'POST', body: JSON.stringify({ text, category }) });
                questions.unshift(d.question);
            } else {
                questions.unshift({ id: 'q-' + Date.now(), text, category, timestamp: new Date().toISOString(), upvotes: 0, votedByMe: false, answers: [] });
                localSave();
            }
            const s = App.getState();
            App.setState({ questions: [...s.questions, { id: 'mine-' + Date.now() }] }); // hitung statistik "Berani Bertanya"
            App.addXP(10);
            App.showToast('✅ Pertanyaan terkirim! (Anonim)');
            render();
        } catch (e) { App.showToast('⚠️ ' + e.message); }
    }

    async function vote(id) {
        const q = questions.find(x => x.id === id);
        if (!q) return;
        try {
            if (online) {
                const d = await api(`/questions/${id}/vote`, { method: 'POST', body: JSON.stringify({ voter: voterId() }) });
                Object.assign(q, d.question);
            } else {
                q.votedByMe = !q.votedByMe;
                q.upvotes = Math.max(0, q.upvotes + (q.votedByMe ? 1 : -1));
                localSave();
            }
            render();
        } catch (e) { App.showToast('⚠️ ' + e.message); }
    }

    function showAnswerForm(id) {
        App.showModal(`
            <h2>💡 Jawab Pertanyaan</h2>
            <p style="font-size:14px;">Bantu temanmu! Jawabanmu juga anonim.</p>
            <div class="input-group" style="margin-top:16px;">
                <textarea id="answer-input" class="textarea-field" maxlength="1000" placeholder="Tulis jawabanmu di sini..." rows="4"></textarea>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-success" onclick="Tanya.submitAnswer('${id}')">✅ Kirim Jawaban</button>
            </div>`);
        setTimeout(() => document.getElementById('answer-input')?.focus(), 100);
    }

    async function submitAnswer(id) {
        const text = document.getElementById('answer-input').value.trim();
        if (text.length < 2) { App.showToast('⚠️ Tulis jawabanmu dulu!'); return; }
        const q = questions.find(x => x.id === id);
        try {
            if (online) {
                const d = await api(`/questions/${id}/answers`, { method: 'POST', body: JSON.stringify({ text, voter: voterId() }) });
                Object.assign(q, d.question);
            } else {
                q.answers.push({ text, timestamp: new Date().toISOString(), isTeacher: false });
                localSave();
            }
            App.addXP(15);
            App.closeModal();
            render();
        } catch (e) { App.showToast('⚠️ ' + e.message); }
    }

    async function remove(id) {
        if (!confirm('Hapus pertanyaan ini?')) return;
        try {
            if (online) await api('/questions/' + id, { method: 'DELETE' });
            questions = questions.filter(q => q.id !== id);
            if (!online) localSave();
            render();
        } catch (e) { App.showToast('⚠️ ' + e.message); }
    }

    function teacherLogin() {
        if (teacherKey()) {
            localStorage.removeItem(TEACHER_KEY);
            App.showToast('Mode guru dimatikan');
            return render();
        }
        App.showModal(`
            <h2>🧑‍🏫 Mode Guru</h2>
            <p style="font-size:13px;">Masukkan kunci guru dari admin server. Jawabanmu akan berlabel "Guru" dan kamu bisa menghapus pertanyaan.</p>
            <div class="input-group" style="margin-top:12px;"><input id="teacher-key" type="password" class="input-field" placeholder="Kunci guru"></div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="Tanya.saveTeacher()">Aktifkan</button>
            </div>`);
    }
    function saveTeacher() {
        const k = document.getElementById('teacher-key').value.trim();
        if (k) { localStorage.setItem(TEACHER_KEY, k); App.showToast('Mode guru aktif'); }
        App.closeModal(); render();
    }

    function setSort(s) { currentSort = s; render(); }
    function setCategory(c) { currentCategory = c; render(); }

    return { load, render, submitQuestion, vote, showAnswerForm, submitAnswer, remove, teacherLogin, saveTeacher, setSort, setCategory };
})();

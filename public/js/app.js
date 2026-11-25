/* ============================================================
   RuangPintar — app.js
   Core: Router, State, Theme, XP/Level, Beranda, Profil
   ============================================================ */

const App = (() => {

    const STORAGE_KEY = 'ruangpintar_v2';

    const DEFAULT_STATE = {
        theme: 'dark',
        studentName: 'Siswa Pintar',
        completedLessons: [],
        lessonProgress: {},
        quizScores: [],
        currentStreak: 0,
        bestStreak: 0,
        totalQuizzesTaken: 0,
        questions: [],
        upvotes: {},
        lastActiveDate: null,
        track: null,
        account: null,
        xp: 0
    };

    let state = {};

    // -------- STATE --------
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            state = saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
        } catch (e) {
            state = { ...DEFAULT_STATE };
        }
        const today = new Date().toDateString();
        if (state.lastActiveDate && state.lastActiveDate !== today) {
            const diff = Math.floor((new Date(today) - new Date(state.lastActiveDate)) / 86400000);
            if (diff > 1) state.currentStreak = 0;
        }
        state.lastActiveDate = today;
        saveState();
    }

    function saveState() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
        catch (e) { console.warn('Could not save state:', e); }
    }

    function getState() { return state; }

    function setState(updates) {
        Object.assign(state, updates);
        saveState();
        updateStreakBadge();
    }

    // -------- THEME --------
    function initTheme() {
        const html = document.documentElement;
        if (!state.theme) state.theme = 'dark';
        html.setAttribute('data-theme', state.theme);
        updateThemeIcon();
        const btnTheme = document.getElementById('btn-theme');
        if (btnTheme) {
            btnTheme.addEventListener('click', () => {
                state.theme = state.theme === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', state.theme);
                updateThemeIcon();
                saveState();
                showToast(state.theme === 'dark' ? 'Mode gelap' : 'Mode terang');
            });
        }
    }

    const ICO_MOON = '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
    const ICO_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

    function updateThemeIcon() {
        const isDark = state.theme === 'dark';
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        if (icon) icon.innerHTML = isDark ? ICO_MOON : ICO_SUN;
        if (text) text.textContent = isDark ? 'Gelap' : 'Terang';

        // Update mobile status bar theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', isDark ? '#0A0E17' : '#6C5CE7');
    }

    // -------- ROUTER --------
    function initRouter() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => navigate(item.dataset.page));
        });
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById('page-' + hash)) navigate(hash);
    }

    function navigate(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + page);
        if (target) {
            target.classList.add('active');
            target.style.animation = 'none';
            target.offsetHeight;
            target.style.animation = '';
        }
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        window.location.hash = page;
        window.scrollTo({ top: 0 });

        if (page === 'beranda') renderBeranda();
        if (page === 'profil') renderProfil();
        if (page === 'materi' && typeof Materi !== 'undefined') Materi.renderList();
        if (page === 'rangkuman' && typeof Rangkuman !== 'undefined') Rangkuman.render();
        if (page === 'kuis' && typeof Kuis !== 'undefined') Kuis.renderModeSelector();
        if (page === 'tanya' && typeof Tanya !== 'undefined') Tanya.render();
        if (page === 'ai' && typeof AITutor !== 'undefined') AITutor.render();
    }

    // -------- TOAST & MODAL --------
    function showToast(message, duration = 2500) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
    }

    function showModal(html) {
        const overlay = document.getElementById('modal-overlay');
        document.getElementById('modal-content').innerHTML = html;
        overlay.classList.remove('hidden');
        overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
    }

    function closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    // -------- STREAK, XP, LEVEL --------
    function updateStreakBadge() {
        document.getElementById('streak-count').textContent = state.currentStreak;
        const trackEl = document.getElementById('track-text');
        if (trackEl) trackEl.textContent = trackLabel();
        const xp = state.xp || 0;
        const lv = document.getElementById('level-text');
        if (lv) lv.textContent = 'Lv ' + (Math.floor(xp / 100) + 1) + ' · ' + (xp % 100) + '/100';
        const fill = document.getElementById('xp-fill');
        if (fill) fill.style.width = (xp % 100) + '%';
    }

    function addXP(n, silent) {
        const before = Math.floor((state.xp || 0) / 100);
        setState({ xp: (state.xp || 0) + n });
        const after = Math.floor(state.xp / 100);
        if (after > before) {
            confetti();
            showToast('🆙 Level naik! Kamu sekarang Level ' + (after + 1) + ' 🎉');
        } else if (!silent) {
            showToast('⭐ +' + n + ' XP');
        }
    }

    function confetti() {
        const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF', '#fd79a8'];
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-piece';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = colors[i % colors.length];
            p.style.animationDelay = (Math.random() * 0.6) + 's';
            p.style.animationDuration = (2 + Math.random() * 1.5) + 's';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4500);
        }
    }

    // -------- UTIL --------
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const diffMs = new Date() - date;
        const min = Math.floor(diffMs / 60000);
        const hr = Math.floor(diffMs / 3600000);
        const day = Math.floor(diffMs / 86400000);
        if (min < 1) return 'Baru saja';
        if (min < 60) return min + ' menit lalu';
        if (hr < 24) return hr + ' jam lalu';
        if (day < 7) return day + ' hari lalu';
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function getGreeting() {
        const h = new Date().getHours();
        if (h < 11) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    function escapeHtml(t) {
        const d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }

    // -------- BERANDA --------
    function renderBeranda() {
        const page = document.getElementById('page-beranda');
        const completedCount = Materi.completedCount();
        const avgScore = state.quizScores.length > 0
            ? Math.round(state.quizScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / state.quizScores.length)
            : 0;

        const acc = state.account;
        const now = new Date();
        const dateLine = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
        const who = acc ? [acc.kelas, acc.sekolah].filter(Boolean).join(' · ') : 'Jurusan ' + trackLabel();
        const tile = (page, cls, svg, title, sub) => `
            <button class="menu-tile ${cls}" onclick="App.navigate('${page}')">
                <span class="mt-ico"><svg viewBox="0 0 24 24">${svg}</svg></span>
                <span class="mt-text"><span class="mt-title">${title}</span><span class="mt-sub">${sub}</span></span>
            </button>`;

        page.innerHTML = `
            <div class="hello">
                <div class="hello-date">${dateLine}</div>
                <h2 class="hello-title">${getGreeting()}, ${escapeHtml(state.studentName)}.</h2>
                <div class="hello-meta">${escapeHtml(who)}</div>
                ${!acc ? `<button class="hello-cta" onclick="Akun.open()">Daftar pakai kartu pelajar →</button>` : ''}
            </div>

            <div class="stats-row">
                <div class="stat-card"><div class="stat-number">${completedCount}</div><div class="stat-label">Materi selesai</div></div>
                <div class="stat-card"><div class="stat-number">${avgScore}%</div><div class="stat-label">Rata-rata kuis</div></div>
                <div class="stat-card"><div class="stat-number">${state.xp || 0}</div><div class="stat-label">Total XP</div></div>
            </div>

            <h3 class="section-title">Mau ngapain hari ini?</h3>
            <div class="menu-grid">
                ${tile('materi', 't-violet', '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2.5z"/><path d="M8 7h8M8 11h5"/>', 'Materi interaktif', 'Belajar lewat simulasi')}
                ${tile('rangkuman', 't-cyan', '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>', 'Rangkuman', 'Rumus & cara ingat')}
                ${tile('kuis', 't-green', '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.5M12 17h.01"/>', 'Kuis pemanasan', '5 menit sebelum kelas')}
                ${tile('tanya', 't-amber', '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', 'Tanya anonim', 'Nggak ada yang tahu kamu')}
                ${tile('ai', 't-pink', '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1M15 13v1M9.5 17h5"/>', 'Tutor', 'Tanya kapan aja')}
            </div>

            <h3 class="section-title">Kenapa kami bikin ini</h3>
            <p class="section-subtitle">Kami survei 47 teman SMA. Ini empat hal yang paling sering dikeluhkan (skala 1–5):</p>
            <div class="survey-bars card">
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">Lebih paham kalau ada visual & praktik</span><span class="sl-score">4.53</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill" data-width="91" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">Pemanasan / kuis di awal kelas membantu</span><span class="sl-score">4.21</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill green" data-width="84" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">Malu bertanya, jadi pura-pura paham</span><span class="sl-score">3.43</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill warm" data-width="69" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">Lupa materi lama, nggak punya catatan ringkas</span><span class="sl-score">3.26</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill cyan" data-width="65" style="width:0%"></div></div>
                </div>
            </div>`;

        setTimeout(() => {
            document.querySelectorAll('.survey-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
        }, 300);
    }

    // -------- PROFIL --------
    function renderProfil() {
        const page = document.getElementById('page-profil');
        const totalLessons = Materi.count();
        const completed = Materi.completedCount();
        const totalQuizzes = state.totalQuizzesTaken;
        const bestScore = state.quizScores.length > 0
            ? Math.max(...state.quizScores.map(s => Math.round((s.score / s.total) * 100)))
            : 0;
        const level = Math.floor((state.xp || 0) / 100) + 1;

        const achievements = [
            { name: 'Langkah pertama', desc: 'Selesaikan 1 materi', unlocked: completed >= 1 },
            { name: 'Kutu buku', desc: 'Selesaikan semua materi', unlocked: completed >= totalLessons },
            { name: 'Sempurna', desc: 'Dapat 100% di satu kuis', unlocked: bestScore === 100 },
            { name: 'Konsisten', desc: 'Streak 3 kali berturut-turut', unlocked: state.bestStreak >= 3 },
            { name: 'Berani nanya', desc: 'Kirim pertanyaan pertama', unlocked: state.questions.length >= 1 },
            { name: 'Rajin kuis', desc: 'Selesaikan 5 kuis', unlocked: totalQuizzes >= 5 },
            { name: 'Naik level', desc: 'Sampai level 3', unlocked: level >= 3 }
        ];
        const got = achievements.filter(a => a.unlocked).length;

        page.innerHTML = `
            ${typeof Akun !== 'undefined' ? Akun.cardHtml() : ''}
            <div class="profile-stats">
                <div class="profile-stat-card"><div class="ps-value">${completed}/${totalLessons}</div><div class="ps-label">Materi selesai</div></div>
                <div class="profile-stat-card"><div class="ps-value">${totalQuizzes}</div><div class="ps-label">Kuis dikerjakan</div></div>
                <div class="profile-stat-card"><div class="ps-value">${bestScore}%</div><div class="ps-label">Skor terbaik</div></div>
                <div class="profile-stat-card"><div class="ps-value">${state.bestStreak}</div><div class="ps-label">Streak terbaik</div></div>
            </div>
            <div class="profile-section">
                <h3>Pencapaian <span class="muted-count">${got}/${achievements.length}</span></h3>
                <div class="achievement-list">
                    ${achievements.map(a => `
                        <div class="achievement-item ${a.unlocked ? '' : 'locked'}">
                            <span class="ach-dot">${a.unlocked ? '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' : '<svg viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8.5a3 3 0 0 1 6 0V11"/></svg>'}</span>
                            <div class="ai-info"><div class="ai-name">${a.name}</div><div class="ai-desc">${a.desc}</div></div>
                        </div>`).join('')}
                </div>
            </div>
            <div style="margin-top:30px;text-align:center;">
                <button class="btn btn-sm btn-secondary" onclick="App.resetData()">Reset semua progres</button>
            </div>`;
    }

    function editName() {
        showModal(`
            <h2>✏️ Ubah Nama</h2>
            <p>Masukkan nama panggilanmu:</p>
            <div class="input-group" style="margin-top:16px;">
                <input type="text" id="input-name" class="input-field" placeholder="Nama kamu..." value="${escapeHtml(state.studentName)}" maxlength="30">
            </div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="App._saveName()">Simpan</button>
            </div>`);
        setTimeout(() => document.getElementById('input-name')?.focus(), 100);
    }

    function _saveName() {
        const name = document.getElementById('input-name').value.trim();
        if (name) {
            setState({ studentName: name });
            closeModal();
            showToast('Nama berhasil diubah! 👋');
            renderProfil();
        }
    }

    function resetData() {
        showModal(`
            <h2>⚠️ Reset Data</h2>
            <p>Semua progres, XP, skor kuis, dan pertanyaan akan dihapus. Yakin?</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-primary" style="background:var(--gradient-warm);" onclick="App._confirmReset()">Ya, Reset</button>
            </div>`);
    }

    function _confirmReset() {
        localStorage.removeItem(STORAGE_KEY);
        loadState();
        updateStreakBadge();
        closeModal();
        showToast('Semua data sudah direset');
        navigate('beranda');
        setTimeout(() => { if (typeof Akun !== 'undefined') Akun.open(); else showOnboarding(); }, 50);
    }

    // -------- JURUSAN (IPA / IPS) --------
    function trackLabel() { return state.track === 'ips' ? 'IPS' : 'IPA'; }

    function showOnboarding() {
        const first = !state.track;
        showModal(`
            <h2>${first ? 'Pilih jurusanmu' : 'Ganti jurusan'}</h2>
            <p>Materi dan kuis bakal menyesuaikan jurusan yang kamu pilih.</p>
            ${first ? `<div class="input-group" style="margin-top:14px;text-align:left;">
                <label>Nama panggilan</label>
                <input id="onb-name" class="input-field" maxlength="30" placeholder="Contoh: Rani" value="${state.studentName !== 'Siswa Pintar' ? escapeHtml(state.studentName) : ''}">
            </div>` : ''}
            <div class="track-cards">
                <div class="track-card ipa ${state.track === 'ipa' ? 'selected' : ''}" onclick="App.chooseTrack('ipa')">
                    <div class="tc-title">IPA</div>
                    <div class="tc-desc">Fisika · Kimia · Biologi · Matematika</div>
                </div>
                <div class="track-card ips ${state.track === 'ips' ? 'selected' : ''}" onclick="App.chooseTrack('ips')">
                    <div class="tc-title">IPS</div>
                    <div class="tc-desc">Ekonomi · Sosiologi · Geografi · Sejarah · Matematika</div>
                </div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);">Bisa diganti kapan aja lewat tombol jurusan di atas.</p>`);
        if (first) document.getElementById('modal-overlay').onclick = null; // wajib memilih saat pertama kali
    }

    function chooseTrack(t) {
        const nameInput = document.getElementById('onb-name');
        const updates = { track: t };
        if (nameInput && nameInput.value.trim()) updates.studentName = nameInput.value.trim();
        const changed = state.track !== t;
        setState(updates);
        closeModal();
        showToast(changed ? 'Jurusan ' + trackLabel() + ' dipilih' : 'Jurusan tetap ' + trackLabel());
        navigate('beranda');
    }

    // -------- INIT --------
    function init() {
        loadState();
        initTheme();
        initRouter();
        const needAccount = typeof Akun !== 'undefined' && !Akun.has() && !Akun.skipped();
        if (needAccount) Akun.open();
        else if (!state.track) showOnboarding();
        updateStreakBadge();
        renderBeranda();
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        getState, setState, navigate, showToast, showModal, closeModal,
        formatDate, addXP, confetti, showOnboarding, chooseTrack, editName, _saveName, resetData, _confirmReset
    };

})();

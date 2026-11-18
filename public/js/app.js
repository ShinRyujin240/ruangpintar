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
                showToast(state.theme === 'dark' ? '🌙 Mode Malam diaktifkan' : '☀️ Mode Siang diaktifkan');
            });
        }
    }

    function updateThemeIcon() {
        const isDark = state.theme === 'dark';
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        if (icon) icon.textContent = isDark ? '🌙' : '☀️';
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

        page.innerHTML = `
            <div class="hero-card">
                <h2>${getGreeting()}, ${escapeHtml(state.studentName)}! 👋</h2>
                <p>🎓 Jurusan ${trackLabel()} · Belajar SMA jadi seru: materi interaktif, kuis kilat, tanya anonim, dan AI Tutor yang siap membantu 24 jam.</p>
            </div>

            <div class="stats-row">
                <div class="stat-card"><div class="stat-number">${completedCount}</div><div class="stat-label">Materi Selesai</div></div>
                <div class="stat-card"><div class="stat-number">${avgScore}%</div><div class="stat-label">Rata-rata Kuis</div></div>
                <div class="stat-card"><div class="stat-number">${state.questions.length}</div><div class="stat-label">Pertanyaan</div></div>
            </div>

            <h3 class="section-title">🚀 Mau belajar apa hari ini?</h3>
            <div class="feature-grid">
                <div class="feature-card purple card-clickable" onclick="App.navigate('materi')">
                    <span class="fc-icon">📖</span><span class="fc-title">Materi Interaktif</span>
                </div>
                <div class="feature-card cyan card-clickable" onclick="App.navigate('rangkuman')">
                    <span class="fc-icon">⚡</span><span class="fc-title">Rangkuman Kilat</span>
                </div>
                <div class="feature-card green card-clickable" onclick="App.navigate('kuis')">
                    <span class="fc-icon">🧠</span><span class="fc-title">Kuis Pemanasan</span>
                </div>
                <div class="feature-card orange card-clickable" onclick="App.navigate('tanya')">
                    <span class="fc-icon">💬</span><span class="fc-title">Tanya Bebas</span>
                </div>
                <div class="feature-card pink card-clickable" onclick="App.navigate('ai')">
                    <span class="fc-icon">🤖</span><span class="fc-title">Tanya AI Tutor</span>
                </div>
            </div>

            <h3 class="section-title">📊 Mengapa Aplikasi Ini Dibuat?</h3>
            <p class="section-subtitle">Berdasarkan survei 47 siswa SMA — solusi bertahap yang kami hadirkan:</p>
            <div class="survey-bars card">
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">🎨 Butuh Media Visual & Interaktif (Rank 1)</span><span class="sl-score">4.53 / 5.00</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill" data-width="91" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">🧩 Butuh Kuis Pemanasan Awal Kelas (Rank 2)</span><span class="sl-score">4.21 / 5.00</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill green" data-width="84" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">🤐 Malu Bertanya di Kelas / Takut Salah (Rank 3)</span><span class="sl-score">3.43 / 5.00</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill warm" data-width="69" style="width:0%"></div></div>
                </div>
                <div class="survey-item">
                    <div class="survey-label"><span class="sl-name">⚡ Lupa Materi & Butuh Rangkuman Cepat (Rank 4)</span><span class="sl-score">3.26 / 5.00</span></div>
                    <div class="survey-bar-bg"><div class="survey-bar-fill cyan" data-width="65" style="width:0%"></div></div>
                </div>
            </div>

            <div class="card" style="margin-top:20px;text-align:center;padding:24px;">
                <p style="font-size:24px;margin-bottom:8px;">💡</p>
                <p style="font-size:14px;color:var(--text-secondary);font-style:italic;">"Satu-satunya pertanyaan bodoh adalah pertanyaan yang tidak ditanyakan."</p>
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
            { icon: '🌟', name: 'Pelajar Pertama', desc: 'Selesaikan 1 materi', unlocked: completed >= 1 },
            { icon: '📚', name: 'Kutu Buku', desc: 'Selesaikan semua materi', unlocked: completed >= totalLessons },
            { icon: '🧠', name: 'Otak Encer', desc: 'Raih skor 100% di kuis', unlocked: bestScore === 100 },
            { icon: '🔥', name: 'On Fire!', desc: 'Streak 3 berturut-turut', unlocked: state.bestStreak >= 3 },
            { icon: '💬', name: 'Berani Bertanya', desc: 'Ajukan pertanyaan pertamamu', unlocked: state.questions.length >= 1 },
            { icon: '🏆', name: 'Juara Kuis', desc: 'Selesaikan 5 kuis', unlocked: totalQuizzes >= 5 },
            { icon: '🆙', name: 'Naik Level', desc: 'Capai Level 3', unlocked: level >= 3 }
        ];

        page.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">👤</div>
                <div class="profile-name">${escapeHtml(state.studentName)}</div>
                <div class="profile-role">Siswa RuangPintar · Level ${level} · ${state.xp || 0} XP</div>
                <button class="btn btn-sm btn-outline" style="margin-top:10px;" onclick="App.editName()">✏️ Ubah Nama</button>
            </div>
            <div class="profile-stats">
                <div class="profile-stat-card"><span class="ps-icon">📖</span><div class="ps-value">${completed}/${totalLessons}</div><div class="ps-label">Materi Selesai</div></div>
                <div class="profile-stat-card"><span class="ps-icon">🧠</span><div class="ps-value">${totalQuizzes}</div><div class="ps-label">Kuis Dikerjakan</div></div>
                <div class="profile-stat-card"><span class="ps-icon">🏆</span><div class="ps-value">${bestScore}%</div><div class="ps-label">Skor Terbaik</div></div>
                <div class="profile-stat-card"><span class="ps-icon">🔥</span><div class="ps-value">${state.bestStreak}</div><div class="ps-label">Best Streak</div></div>
            </div>
            <div class="profile-section">
                <h3>🏅 Pencapaian</h3>
                <div class="achievement-list">
                    ${achievements.map(a => `
                        <div class="achievement-item ${a.unlocked ? '' : 'locked'}">
                            <span class="ai-icon">${a.icon}</span>
                            <div class="ai-info"><div class="ai-name">${a.name}</div><div class="ai-desc">${a.desc}</div></div>
                            ${a.unlocked ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-warning">🔒</span>'}
                        </div>`).join('')}
                </div>
            </div>
            <div style="margin-top:30px;text-align:center;">
                <button class="btn btn-sm btn-secondary" onclick="App.resetData()">🗑️ Reset Semua Data</button>
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
        showToast('Data berhasil direset! 🔄');
        setTimeout(showOnboarding, 50);
        navigate('beranda');
    }

    // -------- JURUSAN (IPA / IPS) --------
    function trackLabel() { return state.track === 'ips' ? 'IPS' : 'IPA'; }

    function showOnboarding() {
        const first = !state.track;
        showModal(`
            <div style="font-size:52px;">🎓</div>
            <h2>${first ? 'Selamat datang di RuangPintar!' : 'Ganti Jurusan'}</h2>
            <p>${first ? 'Kenalan dulu, yuk! Isi namamu dan pilih jurusanmu. Materi &amp; kuis akan menyesuaikan.' : 'Materi dan kuis akan menyesuaikan jurusan yang kamu pilih.'}</p>
            ${first ? `<div class="input-group" style="margin-top:14px;text-align:left;">
                <label>Namamu (boleh nama panggilan)</label>
                <input id="onb-name" class="input-field" maxlength="30" placeholder="Contoh: Rani" value="${state.studentName !== 'Siswa Pintar' ? escapeHtml(state.studentName) : ''}">
            </div>` : ''}
            <div class="track-cards">
                <div class="track-card ipa ${state.track === 'ipa' ? 'selected' : ''}" onclick="App.chooseTrack('ipa')">
                    <span class="tc-icon">🔬</span><div class="tc-title">IPA</div>
                    <div class="tc-desc">Fisika · Kimia · Biologi · Matematika</div>
                </div>
                <div class="track-card ips ${state.track === 'ips' ? 'selected' : ''}" onclick="App.chooseTrack('ips')">
                    <span class="tc-icon">🌏</span><div class="tc-title">IPS</div>
                    <div class="tc-desc">Ekonomi · Sosiologi · Geografi · Sejarah · Matematika</div>
                </div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);">Bisa diganti kapan saja lewat tombol 🎓 di atas.</p>`);
        if (first) document.getElementById('modal-overlay').onclick = null; // wajib memilih saat pertama kali
    }

    function chooseTrack(t) {
        const nameInput = document.getElementById('onb-name');
        const updates = { track: t };
        if (nameInput && nameInput.value.trim()) updates.studentName = nameInput.value.trim();
        const changed = state.track !== t;
        setState(updates);
        closeModal();
        showToast(changed ? '🎓 Jurusan ' + trackLabel() + ' dipilih! Materi & kuis disesuaikan.' : 'Jurusan tetap ' + trackLabel());
        navigate('beranda');
    }

    // -------- INIT --------
    function init() {
        loadState();
        initTheme();
        initRouter();
        if (!state.track) showOnboarding();
        updateStreakBadge();
        renderBeranda();
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        getState, setState, navigate, showToast, showModal, closeModal,
        formatDate, addXP, confetti, showOnboarding, chooseTrack, editName, _saveName, resetData, _confirmReset
    };

})();

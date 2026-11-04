/* ============================================================
   RuangPintar — kuis.js
   Kuis interaktif / pemanasan awal kelas (soal SMA dari soal.js)
   ============================================================ */

const Kuis = (() => {

    const QUESTIONS = window.SOAL_SMA;

    const MODES = {
        warmup: { name: 'Pemanasan Otak', count: 5, timePerQ: 25 },
        challenge: { name: 'Tantangan Penuh', count: 10, timePerQ: 20 }
    };

    const SUBJECT_ICON = { Fisika: '🚀', Matematika: '📈', Kimia: '⚛️', Biologi: '🧫', Ekonomi: '💹', Sosiologi: '🤝', Geografi: '🌋', Sejarah: '🇮🇩', Campuran: '🎲' };

    let currentMode = null;
    let currentSubject = 'Campuran';
    let quizQuestions = [];
    let currentQIndex = 0;
    let score = 0;
    let timer = null;
    let timeLeft = 0;
    let answered = false;

    // soal yang sesuai jurusan siswa (IPA / IPS)
    function pool() {
        const tr = App.getState().track || 'ipa';
        return QUESTIONS.filter(q => (window.SUBJECT_TRACKS[q.category] || ['ipa', 'ips']).includes(tr));
    }
    function subjects() { return [...new Set(pool().map(q => q.category))]; }

    // ============ MODE SELECTOR ============
    function renderModeSelector() {
        clearInterval(timer);
        const page = document.getElementById('page-kuis');
        const state = App.getState();
        if (currentSubject !== 'Campuran' && !subjects().includes(currentSubject)) currentSubject = 'Campuran';
        const last = state.quizScores.length > 0 ? state.quizScores[state.quizScores.length - 1] : null;

        page.innerHTML = `
            <h2 class="section-title" style="margin-top:0;">🧠 Kuis Pemanasan SMA</h2>
            <p class="section-subtitle">Aktifkan otakmu sebelum belajar! Pilih mata pelajaran, lalu pilih mode.</p>

            <div class="chip-group">
                ${['Campuran', ...subjects()].map(s => `
                    <span class="chip ${currentSubject === s ? 'active' : ''}" onclick="Kuis.setSubject('${s}')">${SUBJECT_ICON[s] || '📘'} ${s}</span>`).join('')}
            </div>

            ${last ? `
                <div class="card" style="margin-bottom:20px;text-align:center;">
                    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">Skor Terakhir</p>
                    <p style="font-size:24px;font-weight:800;color:var(--primary);">${last.score}/${last.total}</p>
                    <p style="font-size:12px;color:var(--text-muted);">${last.subject || 'Campuran'} • ${last.mode === 'warmup' ? '🔥 Pemanasan' : '🏆 Tantangan'} • ${App.formatDate(last.date)}</p>
                </div>` : ''}

            <div class="quiz-mode-selector">
                <div class="quiz-mode-card warmup" onclick="Kuis.startQuiz('warmup')">
                    <span class="qm-icon">🔥</span>
                    <div class="qm-title">Pemanasan Otak</div>
                    <div class="qm-desc">5 soal • 25 detik/soal<br>Cocok sebelum kelas dimulai!</div>
                </div>
                <div class="quiz-mode-card challenge" onclick="Kuis.startQuiz('challenge')">
                    <span class="qm-icon">🏆</span>
                    <div class="qm-title">Tantangan Penuh</div>
                    <div class="qm-desc">10 soal • 20 detik/soal<br>Uji pemahamanmu lebih dalam!</div>
                </div>
            </div>

            <h3 class="section-title">📂 Bank Soal</h3>
            <p class="section-subtitle">${pool().length} soal tersedia. Tiap jawaban benar = +10 XP ⭐</p>
            <div class="chip-group">
                ${subjects().map(c => `<span class="badge badge-primary">${SUBJECT_ICON[c]} ${c} (${pool().filter(q => q.category === c).length})</span>`).join('')}
            </div>

            ${state.quizScores.length > 0 ? `
                <h3 class="section-title">📈 Riwayat Kuis</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${state.quizScores.slice(-5).reverse().map(s => {
                        const pct = Math.round((s.score / s.total) * 100);
                        const emoji = pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪';
                        return `
                        <div class="card" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
                            <div>
                                <span>${emoji} ${s.subject || 'Campuran'}</span>
                                <span style="font-size:12px;color:var(--text-muted);margin-left:8px;">${App.formatDate(s.date)}</span>
                            </div>
                            <span style="font-weight:800;color:${pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--primary)' : 'var(--error)'};">${s.score}/${s.total}</span>
                        </div>`;
                    }).join('')}
                </div>` : ''}`;
    }

    function setSubject(s) { currentSubject = s; renderModeSelector(); }

    // ============ START ============
    function startQuiz(mode) {
        currentMode = mode;
        const config = MODES[mode];
        score = 0;
        currentQIndex = 0;
        answered = false;

        const qs = currentSubject === 'Campuran' ? pool() : pool().filter(q => q.category === currentSubject);
        quizQuestions = [...qs].sort(() => Math.random() - 0.5).slice(0, config.count);
        renderQuestion();
    }

    // ============ QUESTION ============
    function renderQuestion() {
        const config = MODES[currentMode];
        const q = quizQuestions[currentQIndex];
        const total = quizQuestions.length;
        answered = false;

        document.getElementById('page-kuis').innerHTML = `
            <div class="quiz-header">
                <button class="btn btn-sm btn-secondary" onclick="Kuis.quitQuiz()">✕ Keluar</button>
                <span class="qh-progress">Soal ${currentQIndex + 1}/${total}</span>
                <div class="quiz-timer" id="quiz-timer"><span>⏱️</span><span id="timer-value">${config.timePerQ}</span></div>
            </div>
            <div class="progress-bar" style="margin-bottom:20px;"><div class="progress-fill" style="width:${(currentQIndex / total) * 100}%;"></div></div>

            <div class="quiz-question-box">
                <div class="qq-number">${SUBJECT_ICON[q.category] || ''} ${q.category}</div>
                <div class="qq-text">${q.question}</div>
            </div>

            <div class="quiz-options" id="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-option" onclick="Kuis.selectAnswer(${i})">
                        <span class="qo-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="qo-text">${opt}</span>
                    </button>`).join('')}
            </div>

            <div id="quiz-explanation" style="display:none;"></div>
            <div id="quiz-next-area" style="display:none;margin-top:20px;text-align:center;">
                <button class="btn btn-primary btn-lg btn-full" onclick="Kuis.nextQuestion()">
                    ${currentQIndex < total - 1 ? 'Soal Berikutnya →' : '🏁 Lihat Hasil'}
                </button>
            </div>`;

        startTimer(config.timePerQ);
    }

    function startTimer(seconds) {
        timeLeft = seconds;
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            const el = document.getElementById('timer-value');
            const timerEl = document.getElementById('quiz-timer');
            if (el) el.textContent = timeLeft;
            if (timerEl && timeLeft <= 5) timerEl.classList.add('warning');
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (!answered) timeUp();
            }
        }, 1000);
    }

    function revealAnswers(chosen) {
        const q = quizQuestions[currentQIndex];
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
            opt.classList.add('disabled');
            if (i === q.correct) opt.classList.add('correct');
            else if (i === chosen) { opt.classList.add('wrong', 'animate-shake'); }
        });
        document.getElementById('quiz-next-area').style.display = 'block';
    }

    function timeUp() {
        answered = true;
        revealAnswers(-1);
        showExplanation('⏰ Waktu habis! ' + quizQuestions[currentQIndex].explanation, false);
    }

    function selectAnswer(index) {
        if (answered) return;
        answered = true;
        clearInterval(timer);
        const q = quizQuestions[currentQIndex];
        const ok = index === q.correct;
        if (ok) score++;
        revealAnswers(index);
        showExplanation((ok ? '✅ Benar! ' : '❌ Kurang tepat. ') + q.explanation, ok);
        if (ok) { const t = document.querySelector('.quiz-option.correct'); if (t) t.classList.add('pop'); }
    }

    function showExplanation(text, ok) {
        const el = document.getElementById('quiz-explanation');
        el.style.display = 'block';
        el.innerHTML = `
            <div class="quiz-explanation" style="border-left-color:${ok ? 'var(--success)' : 'var(--error)'};">
                <div class="qe-label">Penjelasan</div>
                <div class="qe-text">${text}</div>
                ${ok ? '' : `<button class="btn btn-sm btn-outline" style="margin-top:10px;" onclick="AITutor.askAbout('${quizQuestions[currentQIndex].question.replace(/'/g, '').replace(/\n/g, ' ')}')">🤖 Tanya AI Tutor</button>`}
            </div>`;
    }

    function nextQuestion() {
        currentQIndex++;
        if (currentQIndex >= quizQuestions.length) showResult();
        else { renderQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }

    // ============ RESULT ============
    function showResult() {
        clearInterval(timer);
        const total = quizQuestions.length;
        const pct = Math.round((score / total) * 100);

        let emoji, title, subtitle, ring;
        if (pct >= 90) { emoji = '🏆'; title = 'Luar Biasa!'; subtitle = 'Kamu menguasai materi ini!'; ring = 'great'; }
        else if (pct >= 70) { emoji = '🌟'; title = 'Hebat!'; subtitle = 'Pemahamanmu sudah sangat baik!'; ring = 'good'; }
        else if (pct >= 50) { emoji = '👍'; title = 'Cukup Bagus!'; subtitle = 'Terus berlatih ya!'; ring = 'okay'; }
        else { emoji = '💪'; title = 'Jangan Menyerah!'; subtitle = 'Pelajari materinya lagi atau tanya AI Tutor, pasti bisa!'; ring = 'bad'; }

        const state = App.getState();
        const streak = pct >= 50 ? state.currentStreak + 1 : state.currentStreak;
        App.setState({
            quizScores: [...state.quizScores, { mode: currentMode, subject: currentSubject, score, total, date: new Date().toISOString() }],
            totalQuizzesTaken: state.totalQuizzesTaken + 1,
            currentStreak: streak,
            bestStreak: Math.max(state.bestStreak, streak)
        });
        App.addXP(score * 10, true);
        if (pct >= 70) App.confetti();

        document.getElementById('page-kuis').innerHTML = `
            <div class="quiz-result">
                <span class="qr-emoji">${emoji}</span>
                <h2 class="qr-title">${title}</h2>
                <p class="qr-subtitle">${subtitle}</p>
                <div class="qr-score-ring ${ring}">${pct}%</div>
                <div class="qr-stats">
                    <div class="qr-stat"><div class="qs-value">${score}/${total}</div><div class="qs-label">Benar</div></div>
                    <div class="qr-stat"><div class="qs-value">⭐ ${score * 10}</div><div class="qs-label">XP</div></div>
                    <div class="qr-stat"><div class="qs-value">🔥 ${streak}</div><div class="qs-label">Streak</div></div>
                </div>
                <div class="qr-buttons">
                    <button class="btn btn-secondary" onclick="Kuis.renderModeSelector()">🏠 Menu Kuis</button>
                    <button class="btn btn-primary" onclick="Kuis.startQuiz('${currentMode}')">🔄 Main Lagi</button>
                </div>
            </div>`;
    }

    function quitQuiz() {
        clearInterval(timer);
        App.showModal(`
            <h2>⏸️ Keluar Kuis?</h2>
            <p>Progres kuis ini tidak akan disimpan.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button class="btn btn-secondary" onclick="App.closeModal()">Lanjut Kuis</button>
                <button class="btn btn-primary" onclick="App.closeModal(); Kuis.renderModeSelector();">Ya, Keluar</button>
            </div>`);
    }

    document.addEventListener('DOMContentLoaded', renderModeSelector);

    return { renderModeSelector, setSubject, startQuiz, selectAnswer, nextQuestion, quitQuiz };

})();

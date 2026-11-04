'use strict';
/**
 * RuangPintar — backend (tanpa dependency, butuh Node >= 18)
 *  - Menyajikan website statis dari /public
 *  - API forum anonim bersama  : /api/questions ...
 *  - API AI Tutor (proxy Gemini): /api/ai   (API key aman di server)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------- .env sederhana ----------
try {
    fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) {
            process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    });
} catch (e) { /* .env opsional */ }

const PORT = +process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'forum.json');
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const TEACHER_KEY = process.env.TEACHER_KEY || '';

const SYSTEM_PROMPT = `Kamu adalah "Pintar", tutor AI yang ramah untuk siswa SMA Indonesia di platform RuangPintar.
Aturan:
- Jawab dalam Bahasa Indonesia yang santai tapi jelas, sesuai kurikulum SMA (IPA: Fisika, Kimia, Biologi, Matematika; IPS: Ekonomi, Sosiologi, Geografi, Sejarah).
- Jelaskan langkah demi langkah, beri contoh singkat dan analogi sehari-hari.
- Untuk soal hitungan, tunjukkan langkah penyelesaian, lalu ajak siswa mencoba soal serupa.
- Jawaban ringkas (maks ~180 kata), gunakan poin-poin dan **tebal** untuk istilah kunci.
- Siswa mungkin malu bertanya: selalu apresiasi pertanyaannya dan jangan menghakimi.
- Jika di luar topik belajar, arahkan kembali dengan sopan.`;

// ---------- Penyimpanan forum (file JSON) ----------
let db = { questions: [] };
function loadDb() {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        db = { questions: require('./seed.js')() };
        saveDb();
    }
}
function saveDb() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, DB_FILE);
}
loadDb();

// ---------- Utilitas ----------
const buckets = new Map();
function limited(ip, name, max, windowMs) {
    const k = name + ':' + ip, now = Date.now();
    const arr = (buckets.get(k) || []).filter(t => now - t < windowMs);
    arr.push(now);
    buckets.set(k, arr);
    return arr.length > max;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of buckets) if (!v.some(t => now - t < 120000)) buckets.delete(k); }, 60000).unref();

function clientIp(req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}
function send(res, status, obj) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(obj));
}
function readBody(req, limit = 20000) {
    return new Promise((resolve, reject) => {
        let size = 0, chunks = [];
        req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
        req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); } catch (e) { reject(new Error('bad json')); } });
        req.on('error', reject);
    });
}
function isTeacher(req) {
    const k = String(req.headers['x-teacher-key'] || '');
    if (!TEACHER_KEY || !k) return false;
    const a = Buffer.from(k), b = Buffer.from(TEACHER_KEY);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const clean = (s, max) => String(s || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const VALID_CATEGORIES = ['materi', 'tugas', 'ujian', 'umum'];

function publicQuestion(q, voter) {
    return {
        id: q.id, text: q.text, category: q.category, timestamp: q.timestamp,
        upvotes: q.voters.length + (q.baseVotes || 0),
        votedByMe: !!voter && q.voters.includes(voter),
        answers: q.answers
    };
}

// ---------- Router API ----------
async function handleApi(req, res, url) {
    const ip = clientIp(req);
    const parts = url.pathname.split('/').filter(Boolean); // ['api', ...]
    const method = req.method;

    if (url.pathname === '/api/health') return send(res, 200, { ok: true, ai: !!GEMINI_KEY, teacherMode: !!TEACHER_KEY });

    // ----- Forum -----
    if (parts[1] === 'questions') {
        if (method === 'GET' && parts.length === 2) {
            const voter = clean(url.searchParams.get('voter'), 64);
            return send(res, 200, { questions: db.questions.map(q => publicQuestion(q, voter)) });
        }
        if (method === 'POST' && parts.length === 2) {
            if (limited(ip, 'write', 10, 60000)) return send(res, 429, { error: 'Terlalu cepat, coba sebentar lagi.' });
            const b = await readBody(req);
            const text = clean(b.text, 500);
            if (text.length < 10) return send(res, 400, { error: 'Pertanyaan minimal 10 karakter.' });
            const q = {
                id: 'q-' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
                text, category: VALID_CATEGORIES.includes(b.category) ? b.category : 'umum',
                timestamp: new Date().toISOString(), voters: [], baseVotes: 0, answers: []
            };
            db.questions.unshift(q);
            if (db.questions.length > 500) db.questions.length = 500;
            saveDb();
            return send(res, 201, { question: publicQuestion(q, '') });
        }
        const q = db.questions.find(x => x.id === parts[2]);
        if (!q) return send(res, 404, { error: 'Pertanyaan tidak ditemukan.' });

        if (method === 'POST' && parts[3] === 'vote') {
            if (limited(ip, 'vote', 40, 60000)) return send(res, 429, { error: 'Terlalu cepat.' });
            const b = await readBody(req);
            const voter = clean(b.voter, 64);
            if (!voter) return send(res, 400, { error: 'voter wajib' });
            const i = q.voters.indexOf(voter);
            if (i >= 0) q.voters.splice(i, 1); else q.voters.push(voter);
            saveDb();
            return send(res, 200, { question: publicQuestion(q, voter) });
        }
        if (method === 'POST' && parts[3] === 'answers') {
            if (limited(ip, 'write', 10, 60000)) return send(res, 429, { error: 'Terlalu cepat, coba sebentar lagi.' });
            const b = await readBody(req);
            const text = clean(b.text, 1000);
            if (text.length < 2) return send(res, 400, { error: 'Jawaban terlalu pendek.' });
            if (q.answers.length >= 20) return send(res, 400, { error: 'Jawaban sudah penuh.' });
            q.answers.push({ text, timestamp: new Date().toISOString(), isTeacher: isTeacher(req) });
            saveDb();
            return send(res, 201, { question: publicQuestion(q, clean(b.voter, 64)) });
        }
        if (method === 'DELETE' && parts.length === 3) {
            if (!isTeacher(req)) return send(res, 403, { error: 'Khusus guru.' });
            db.questions = db.questions.filter(x => x.id !== q.id);
            saveDb();
            return send(res, 200, { ok: true });
        }
        return send(res, 405, { error: 'Method tidak didukung.' });
    }

    // ----- AI Tutor -----
    if (url.pathname === '/api/ai' && method === 'POST') {
        if (!GEMINI_KEY) return send(res, 503, { error: 'AI belum dikonfigurasi di server.', offline: true });
        if (limited(ip, 'ai', 20, 60000)) return send(res, 429, { error: 'Terlalu banyak pertanyaan, tunggu sebentar ya 🙏' });
        const b = await readBody(req, 30000);
        const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-12)
            .map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: clean(m.text, 2000) }] }))
            .filter(m => m.parts[0].text);
        if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return send(res, 400, { error: 'Pesan kosong.' });
        const track = b.track === 'ips' ? 'IPS' : b.track === 'ipa' ? 'IPA' : '';
        const sys = SYSTEM_PROMPT + (track ? `\nSiswa ini memilih jurusan ${track}; sesuaikan contoh dan tingkat bahasan.` : '');
        try {
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                body: JSON.stringify({ systemInstruction: { parts: [{ text: sys }] }, contents: msgs }),
                signal: AbortSignal.timeout(25000)
            });
            if (!r.ok) {
                console.error('Gemini error', r.status, (await r.text()).slice(0, 200));
                return send(res, 502, { error: 'AI sedang bermasalah, coba lagi nanti.' });
            }
            const data = await r.json();
            const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
            if (!text) return send(res, 502, { error: 'AI tidak memberi jawaban.' });
            return send(res, 200, { text });
        } catch (e) {
            console.error('Gemini fetch failed:', e.message);
            return send(res, 502, { error: 'Tidak bisa menghubungi AI.' });
        }
    }

    return send(res, 404, { error: 'Endpoint tidak ada.' });
}

// ---------- File statis ----------
const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp'
};
function serveStatic(req, res, url) {
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(PUBLIC_DIR, rel));
    if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (err, data) => {
        if (err) {
            // SPA fallback
            return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
                if (e2) { res.writeHead(404); return res.end('Not found'); }
                res.writeHead(200, { 'Content-Type': MIME['.html'] });
                res.end(html);
            });
        }
        const ext = path.extname(file).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300'
        });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'same-origin');
    try {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
        if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
        return serveStatic(req, res, url);
    } catch (e) {
        if (!res.headersSent) send(res, e.message === 'too large' ? 413 : 400, { error: 'Permintaan tidak valid.' });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎓 RuangPintar jalan di http://localhost:${PORT}`);
    console.log(`   AI Tutor : ${GEMINI_KEY ? 'AKTIF (Gemini ' + GEMINI_MODEL + ')' : 'belum aktif (isi GEMINI_API_KEY di .env)'}`);
    console.log(`   Mode guru: ${TEACHER_KEY ? 'AKTIF' : 'nonaktif (isi TEACHER_KEY di .env)'}\n`);
});

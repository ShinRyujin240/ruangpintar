# 🎓 RuangPintar — E-Learning Interaktif SMA (IPA & IPS)

Website belajar untuk siswa SMA, dibuat berdasarkan survei 47 siswa. Fokus pada 3 masalah terbesar:
1. **Butuh media visual & interaktif** → materi dengan simulasi (slider, grafik, papan Punnett, linimasa).
2. **Butuh kuis pemanasan** → kuis kilat bertimer, XP, level, dan streak.
3. **Malu bertanya** → forum **anonim** bersama + **AI Tutor** yang siap ditanya kapan saja.

Siswa memilih jurusan **IPA** atau **IPS** di awal; materi dan kuis menyesuaikan.

| Jurusan | Materi |
|---|---|
| IPA | Hukum Newton, Gerak Lurus (GLB/GLBB), Trigonometri, Fungsi Kuadrat, Struktur Atom, Konsep Mol, Sel & Transpor, Genetika (Mendel), Statistika |
| IPS | Permintaan & Penawaran, Sosiologi (interaksi & kelompok sosial), Geografi (litosfer), Sejarah (menuju kemerdekaan), Fungsi Kuadrat, Statistika |

## ▶️ Menjalankan di komputer sendiri

Butuh **Node.js 18+** (tanpa `npm install`, tanpa dependency).

```bash
node server.js
# buka http://localhost:3000
```

### Mengaktifkan AI Tutor (opsional tapi disarankan)
1. Ambil API key Gemini gratis di https://aistudio.google.com/apikey
2. Salin `.env.example` menjadi `.env`, lalu isi:
   ```
   GEMINI_API_KEY=isi_key_kamu
   TEACHER_KEY=kata_sandi_guru
   ```
3. Jalankan ulang `node server.js`. API key **hanya ada di server**, tidak terlihat siswa.

Tanpa key, AI Tutor tetap jalan dalam **mode offline** (menjawab topik dari materi yang ada).

### Mode Guru
Guru membuka menu **Tanya** → tombol **🧑‍🏫 Saya guru** → masukkan `TEACHER_KEY`. Jawaban guru diberi label khusus dan guru bisa menghapus pertanyaan yang tidak pantas.

## 🌍 Membagikan ke siswa (online)

### Opsi A — Render.com (gratis, paling mudah)
1. Upload folder ini ke repo GitHub.
2. Di https://render.com → **New → Blueprint** (atau Web Service) → pilih repo. File `render.yaml` sudah disiapkan.
3. Isi environment variable `GEMINI_API_KEY` dan `TEACHER_KEY`.
4. Setelah deploy, kamu mendapat link `https://namamu.onrender.com` yang bisa dibagikan.

> ℹ️ Paket gratis Render tidur saat sepi (buka pertama bisa ±30 detik) dan disk-nya sementara, sehingga pertanyaan forum bisa kembali ke data awal saat server restart. Untuk data permanen, tambahkan *persistent disk* dan set `DATA_DIR` ke folder disk tersebut.

### Opsi B — Docker (VPS / Railway / Fly.io)
```bash
docker build -t ruangpintar .
docker run -p 3000:3000 -v ruangpintar-data:/data \
  -e GEMINI_API_KEY=... -e TEACHER_KEY=... ruangpintar
```

### Opsi C — Sementara dari laptop (demo kelas)
- **Satu Wi-Fi**: jalankan `node server.js`, lalu bagikan `http://IP-LAPTOPMU:3000` (cek IP dengan `ipconfig`).
- **Lewat internet**: jalankan tunnel, mis. `cloudflared tunnel --url http://localhost:3000` atau `ngrok http 3000`, lalu bagikan link yang muncul.

## 🗂️ Struktur proyek
```
server.js        backend (static server + API forum + proxy AI), tanpa dependency
seed.js          pertanyaan awal forum
public/          website (HTML/CSS/JS)
  js/materi*.js  materi interaktif       js/soal*.js  bank soal
  js/kuis.js     kuis                    js/tanya.js  forum anonim
  js/ai.js       AI Tutor                js/app.js    inti aplikasi
data/forum.json  data forum (dibuat otomatis)
```

## 🔒 Catatan keamanan & privasi
- Forum anonim: server tidak menyimpan nama; vote memakai ID acak per perangkat.
- Ada pembatasan laju (rate limit) untuk forum dan AI agar tidak disalahgunakan.
- Isi pertanyaan di-escape di sisi tampilan (anti XSS).
- Progres belajar (XP, skor) disimpan di browser masing-masing siswa (`localStorage`).

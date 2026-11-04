'use strict';
// Pertanyaan awal forum agar tidak kosong saat pertama kali dibuka.
module.exports = function seed() {
    const ago = ms => new Date(Date.now() - ms).toISOString();
    const H = 3600000, D = 86400000;
    const mk = (id, text, category, timeAgo, baseVotes, answers) =>
        ({ id, text, category, timestamp: ago(timeAgo), voters: [], baseVotes, answers: answers || [] });
    return [
        mk('seed-1', 'Kak, beda massa sama berat itu apa sih? Kok di rumus Newton kadang pakai m kadang pakai w?', 'materi', 2 * H, 14, [
            { text: 'Massa (kg) = banyaknya materi, nilainya tetap di mana pun. Berat (N) = gaya gravitasi pada benda, w = m·g, jadi berubah kalau g berubah (misal di Bulan). Di Hukum II Newton yang dipakai adalah m untuk a = F/m.', timestamp: ago(H), isTeacher: true }
        ]),
        mk('seed-2', 'Kalau diskriminan negatif, berarti grafiknya nggak ada dong? Gimana bentuknya?', 'materi', 6 * H, 9, [
            { text: 'Grafiknya tetap ada, yaitu parabola. Bedanya parabola itu tidak memotong sumbu x, jadi tidak ada akar real. Coba geser slider di materi Fungsi Kuadrat untuk melihatnya!', timestamp: ago(5 * H), isTeacher: false }
        ]),
        mk('seed-3', 'Bedanya permintaan sama jumlah yang diminta apa ya? Suka ketuker di ekonomi.', 'materi', 20 * H, 11, [
            { text: 'Perubahan HARGA barang itu sendiri menggeser titik di sepanjang kurva = perubahan jumlah yang diminta. Kalau yang berubah faktor lain (pendapatan, selera, harga barang lain), seluruh kurva yang bergeser = perubahan permintaan.', timestamp: ago(18 * H), isTeacher: true }
        ]),
        mk('seed-4', 'Cara cepat nentuin elektron valensi dari nomor atom gimana ya? Suka salah di kulit ketiga.', 'materi', D, 6, []),
        mk('seed-5', 'Perbedaan akulturasi sama asimilasi di sosiologi itu apa? Contohnya apa?', 'materi', 1.5 * D, 7, []),
        mk('seed-6', 'Kapan ulangan harian bab Sel / Sejarah ya? Ada yang tau materinya sampai mana?', 'ujian', 2 * D, 3, [])
    ];
};

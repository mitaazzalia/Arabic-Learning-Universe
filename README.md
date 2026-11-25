# Arabic Learning Universe v0.2

Prototype platform pembelajaran Bahasa Arab dengan eksplorasi dunia 3D bergaya animasi kartun orisinal. Visual 3D pada versi ini dibangun dari geometri Three.js yang disusun secara manual (bukan rangkaian gambar AI yang ditempelkan), dengan bentuk membulat, warna hangat, pencahayaan lembut, pulau mini, bangunan, pepohonan, dan dua maskot sederhana.

## Fitur versi 0.2

- Dunia 3D dengan 12 pulau lokasi belajar yang dapat diputar dan diperbesar.
- Diorama mini yang berbeda untuk sekolah, kantin, perpustakaan, rumah, pasar, masjid, rumah sakit, taman, stasiun, restoran, dan pantai.
- Dua maskot 3D orisinal sebagai karakter pemandu di pulau utama.
- Pilihan jenjang SMP dan SMA dengan bacaan, audio, dan kosakata terpisah.
- Materi `mahārah al-qirā'ah` berupa bacaan Arab berharakat dan terjemahan.
- Materi `mahārah al-istimā'` dengan pemutar audio, pilihan kecepatan lambat (0,75×) dan normal (1×), serta transkrip yang dapat disembunyikan.
- Tiga tahap evaluasi: mudah (`beginner`), menengah (`intermediate`), dan sulit (`advanced`).
- Setiap lokasi dan jenjang memiliki bank 10 pertanyaan per tahap. Lima pertanyaan dipilih secara acak untuk setiap percobaan; urutan soal juga diacak.
- Level berikutnya terbuka setelah peserta didik memperoleh nilai minimal 75.
- Progres kelulusan setiap tahap disimpan pada `localStorage` browser.
- Skema Supabase diperluas untuk bank soal, pertanyaan, percobaan, dan progres per tahap.

## Persyaratan

- Node.js 20.19+ atau 22.12+
- npm 10+
- Browser modern dengan dukungan WebGL.

## Menjalankan aplikasi

1. Ekstrak folder proyek.
2. Buka terminal di folder `arabic-learning-universe`.
3. Instal dependensi:

   ```bash
   npm install
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Build untuk produksi

```bash
npm run typecheck
npm run build
npm run preview
```

Hasil build berada di folder `dist/`.

## Konfigurasi Supabase

1. Buat proyek di Supabase.
2. Salin `.env.example` menjadi `.env.local`.
3. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. Jalankan `supabase/schema.sql` melalui Supabase Dashboard → SQL Editor.
5. Terbitkan data lokasi dan materi pada tabel `public.lessons`.
6. Bank soal versi prototipe saat ini dibentuk di sisi frontend dari materi, kosakata, dan soal dasar. Tabel `question_banks` dan `questions` disiapkan untuk tahap berikutnya ketika bank soal dikelola langsung dari Supabase.

Gunakan hanya anon/publishable key pada frontend. Jangan pernah memasukkan `service_role` key ke file `.env` frontend atau repositori publik. Kebijakan RLS pada skema membatasi data progres dan percobaan berdasarkan `auth.uid()`.

## Audio Bahasa Arab

Versi prototipe menggunakan fallback `SpeechSynthesis` browser jika URL MP3 belum tersedia. Kecepatan 0,75× dan 1× diterapkan pada audio MP3 maupun TTS. Kualitas suara Arab bergantung pada suara bahasa Arab yang tersedia pada perangkat dan browser. Untuk penggunaan produksi, rekaman penutur Bahasa Arab sebaiknya diunggah ke bucket `arabic-audio`.

## Struktur folder

```text
arabic-learning-universe/
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── LessonModal.tsx
│   │   ├── QuizPanel.tsx
│   │   └── UniverseScene.tsx
│   ├── data/
│   │   ├── lessons.ts
│   │   └── questionBanks.ts
│   ├── lib/
│   │   ├── lessonRepository.ts
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── index.css
│   ├── v02.css
│   ├── main.tsx
│   └── types.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── index.html
└── package.json
```

## Catatan validasi

- Bank soal 10 item per tahap disusun dengan pola berbasis materi, kosakata, ringkasan, dan konteks lokasi. Sebelum digunakan sebagai penilaian resmi, guru Bahasa Arab perlu meninjau ketepatan bahasa, tingkat kesulitan, dan validitas setiap butir.
- Progres v0.2 masih tersimpan lokal pada browser. Sinkronisasi progres lintas perangkat memerlukan autentikasi dan integrasi penyimpanan Supabase yang akan dibangun pada tahap berikutnya.
- Audio penutur asli belum disertakan; saat ini browser menyediakan suara sintetis sebagai pratinjau.
- Maskot dan diorama 3D saat ini berupa model geometris sederhana. Ini merupakan arah visual awal; model karakter dan lingkungan yang lebih rinci dapat dibuat setelah desain karakter disetujui.

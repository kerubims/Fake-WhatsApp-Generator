Berikut adalah dokumen **Product Requirements Document (PRD)** lengkap untuk aplikasi Fake WhatsApp Chat Generator, disusun menggunakan format Markdown. Dokumen ini merangkum seluruh spesifikasi teknis, desain, dan logika yang telah kita sepakati.

---

# 📄 Product Requirements Document (PRD): Fake WhatsApp Chat Generator

**Status Dokumen:** Final

**Platform Target:** Web Application (Client-Side)

**Tujuan UI:** WhatsApp Android (100% Akurasi)

**Tumpukan Teknologi (Tech Stack):** HTML5, CSS3, Vanilla JavaScript (ES6+)

---

## 1. Ringkasan Eksekutif (Executive Summary)

Produk ini adalah aplikasi berbasis web yang memungkinkan pengguna membuat gambar tiruan percakapan WhatsApp Android yang 100% realistis. Aplikasi ini murni beroperasi di sisi klien (browser) tanpa *backend*. Fitur utama mencakup kustomisasi metadata yang detail (waktu, tanda baca, profil), logika otomatisasi percakapan agar masuk akal, dan kemampuan mengekspor antarmuka langsung menjadi gambar PNG beresolusi tinggi. Sesuai batasan, aplikasi tidak akan menggunakan *emoticon/emoji* bawaan OS untuk menghindari perbedaan render visual antar perangkat.

---

## 2. Spesifikasi Teknis & Lingkungan

* **Struktur:** HTML5 murni tanpa framework JS (React/Vue/Angular).
* **Styling:** CSS3 dengan Flexbox/Grid dan CSS Variables (`:root`) untuk mempermudah manajemen warna tema.
* **Logika & Interaktivitas:** Vanilla JavaScript.
* **Library Pihak Ketiga:** `html2canvas` (atau `dom-to-image`) eksklusif hanya untuk fitur ekspor DOM ke PNG.
* **Aset Visual:** Penggunaan format **SVG statis** untuk seluruh ikon (centang 1, centang 2, panah kembali, titik tiga, kamera, dll).
* **Tipografi:** Google Font **"Roboto"** (Font standar sistem operasi Android).
* **Larangan Mutlak:** Tidak menggunakan emoji/emoticon (bawaan OS) pada teks default, dan tidak merender status bar ponsel (baterai, sinyal).

---

## 3. Arsitektur Antarmuka & Tata Letak (Layout)

Aplikasi memiliki dua lingkungan antarmuka yang diatur responsivitasnya secara berbeda:

### 3.1. Area Workspace Aplikasi (Responsif Web)

Layout area kerja (tempat pengguna melakukan input) harus beradaptasi dengan layar perangkat pengguna:

* **Desktop / Tablet (Layar Lebar):** Layout *Side-by-Side* (Kiri 60% untuk Panel Kontrol, Kanan 40% untuk Live Preview). Area Live Preview bersifat *sticky* (menempel di layar) saat Panel Kontrol di-scroll.
* **Mobile (Smartphone):** Layout *Stacked* (Atas-Bawah). Live Preview berada di atas (dengan rasio yang dikecilkan menggunakan `transform: scale`), sedangkan Panel Kontrol berada di bawah memanjang untuk memudahkan pengetikan.

### 3.2. Area Live Preview (Statis & Fixed Ratio)

Area ini adalah kontainer yang akan dirender menjadi PNG. **Tidak responsif melebar**, melainkan dikunci dimensinya untuk mereplika *screenshot* ponsel:

* **Lebar Tetap:** `412px` (Standar resolusi lebar Android modern).
* **Tinggi Dinamis:** Menyesuaikan panjang percakapan (seperti *Long Screenshot*).
* **Latar Belakang Chat:** Warna solid ditambah pola *doodle* khas WhatsApp (diterapkan melalui `background-image` menggunakan base64 image/SVG opacity rendah).

---

## 4. Kebutuhan Fungsional (Functional Requirements)

### 4.1. Panel Header (Kustomisasi Profil)

* **Upload Foto Profil:** Input tipe file untuk gambar.
* **Fallback Foto Profil:** Jika gambar tidak diunggah, otomatis membuat lingkaran dengan *background color* solid dan huruf inisial dari "Nama Kontak" di tengahnya.
* **Nama Kontak:** Input teks untuk nama lawan bicara (dicetak tebal/medium pada preview).
* **Status Aktivitas:** Input teks opsional di bawah nama (misal: "Online", "mengetik...", "terakhir dilihat hari ini 10:45").

### 4.2. Timeline Editor (Kustomisasi Percakapan)

Pengguna dapat menambahkan, menghapus, atau mengurutkan tiga jenis elemen:

1. **Date Bubble (Batas Tanggal):** Input teks tunggal untuk penanda waktu (misal: "HARI INI", "KEMARIN", "12 Mei 2023").
2. **Pesan Masuk (Lawan Bicara):**
* Input: Teks Pesan dan Waktu (Jam:Menit).


3. **Pesan Keluar (Pengirim):**
* Input: Teks Pesan, Waktu (Jam:Menit), dan Dropdown Status Baca (Terkirim, Diterima, Dibaca).



### 4.3. Logika JavaScript & Validasi (Aturan Realistis)

Sistem memiliki validasi JS otomatis untuk mencegah kesalahan logika (error logic):

* **Validasi Waktu Maju:** Waktu pada pesan baru *default*-nya mengikuti pesan terakhir. Jika pengguna mengetik waktu yang **lebih lampau** dari pesan sebelumnya, form input ditolak, border input menjadi merah, dan muncul *error message*: *"Waktu tidak boleh mundur dari pesan sebelumnya."*
* **Otomatisasi Centang Biru (Read Receipt):** Jika ada *Pesan Keluar* dengan status Centang 1 (Terkirim) atau Centang 2 Abu (Diterima), kemudian pengguna menambahkan *Pesan Masuk* (balasan dari lawan bicara) di bawahnya, maka JS **wajib** mengubah seluruh status pesan keluar sebelumnya menjadi **Centang 2 Biru (Dibaca)**.

### 4.4. Mesin Ekspor (Export to PNG)

* Menjalankan skrip `html2canvas` pada elemen `#live-preview-container`.
* Skala ekspor (scale) diatur minimal `2` atau `3` agar teks tetap tajam (anti-aliasing optimal) saat hasil PNG di-zoom.
* Trigger pengunduhan otomatis dengan nama file: `WA_FakeChat_[NamaKontak]_[Timestamp].png`.

---

## 5. Kebutuhan Non-Fungsional & Akurasi UI (CSS Styling)

Untuk mencapai kemiripan 100% dengan UI WhatsApp Android (Light Mode), spesifikasi CSS berikut wajib diterapkan:

### 5.1. Palet Warna (Color Scheme)

* **Header Bar:** `#008069` (Hijau WhatsApp Android)
* **Teks Header:** `#FFFFFF`
* **Latar Belakang (Chat Background):** `#EFEAE2` (beserta WA Doodle Background).
* **Gelembung Pesan Keluar (Outgoing):** `#E7FFDB`
* **Gelembung Pesan Masuk (Incoming):** `#FFFFFF`
* **Date Bubble Background:** `#FFFFFF` (opacity/transparansi khusus, atau warna `#E1F2FB` bergantung versi UI), dengan *box-shadow* tipis.
* **Centang Biru:** `#53BDEB`
* **Centang Abu/Teks Waktu:** `#8696A0` atau `#667781`

### 5.2. Geometri Gelembung Pesan (Chat Bubbles)

* **Max-Width:** `80%` dari total lebar layar preview.
* **Border-Radius:** Melengkung (sekitar `8px`), kecuali pada sudut asal pesan.
* **Ekor Pesan (Chat Tail):** Dibuat MURNI menggunakan CSS Pseudo-elements (`::before` atau `::after`) dipadukan dengan trik *CSS border transparent* membentuk segitiga berukuran presisi (sekitar `8px` x `13px`). Tidak menggunakan gambar ekor terpisah.
* **Layout Metadata:** Waktu dan Ikon Centang berada di pojok kanan bawah gelembung.
* Jika teks pendek, waktu sejajar di kanan teks.
* Jika teks panjang dan mencapai ujung kanan gelembung, teks harus melakukan `word-wrap: break-word`, dan waktu beserta ikon memiliki margin khusus agar posisi mereka tepat menggantung di bawah pojok kanan kalimat terakhir tanpa menimpa teks.



---

## 6. Tahapan Pengembangan (Development Phases)

* **Fase 1: Struktur & Layouting (HTML/CSS)**
* Membangun struktur split-view (Control Panel & Live Preview).
* Membuat replika statis UI WhatsApp (Header, Chat Background, Bubble In, Bubble Out, Date Bubble) dengan data statis.


* **Fase 2: Interaktivitas Form (JavaScript)**
* Menghubungkan form input di Control Panel agar setiap pengetikan (keyup/change) merender teks langsung ke elemen Live Preview.
* Membangun fungsi *Create, Read, Update, Delete* (CRUD) untuk list pesan pada memori lokal/DOM.


* **Fase 3: Logika Realistis (JavaScript Validations)**
* Mengimplementasikan filter validasi waktu (tidak boleh mundur).
* Mengimplementasikan deteksi otomatis perubahan status centang biru saat ada pesan masuk.


* **Fase 4: Finalisasi & Ekspor (html2canvas)**
* Mengintegrasikan library *export*.
* Pengujian *cross-device layout* (memastikan responsivitas web benar, tetapi hasil ekspor tetap statis).



---
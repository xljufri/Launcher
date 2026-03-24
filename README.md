<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🌌 Aurora Launcher

**Minimalist, Aesthetic, and AI-Powered Web Launcher.**

Aurora Launcher adalah antarmuka peluncur (launcher) berbasis web yang dirancang dengan estetika minimalis dan modern. Terinspirasi dari sistem operasi seluler premium, peluncur ini menawarkan pengalaman navigasi yang mulus, kustomisasi tema yang mendalam, dan fitur wallpaper bertenaga AI.

[Demo Langsung](#) | [Laporkan Bug](https://github.com/xljufri/Launcher/issues) | [Minta Fitur](https://github.com/xljufri/Launcher/issues)

</div>

---

## ✨ Fitur Utama

- **🎨 Kustomisasi Tema:** Berbagai pilihan tema (Obsidian, Amethyst, Gold, Cyber, Matcha, Sakura, Ocean, Nordic) dengan palet warna yang indah.
- **✨ Wallpaper AI:** Integrasi dengan Google Gemini untuk menghasilkan deskripsi wallpaper yang sesuai dengan waktu (Pagi, Siang, Sore, Malam).
- **📱 Pengalaman Mobile:** Desain responsif dengan dukungan gestur (swipe up untuk laci aplikasi, swipe down untuk notifikasi).
- **🔍 Pencarian Cepat:** Bilah pencarian minimalis untuk mencari aplikasi atau web dengan mudah.
- **🔋 Status Bar:** Menampilkan jam, baterai, dan status koneksi secara real-time.
- **🖼️ Widget Jam:** Berbagai gaya jam (Minimal, Bold, Glass, Digital).

---

## 🚀 Memulai (Local Development)

Ikuti langkah-langkah ini untuk menjalankan Aurora Launcher di komputer lokal Anda:

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi terbaru disarankan)
- npm atau pnpm

### Langkah-langkah
1. **Klon Repositori:**
   ```bash
   git clone https://github.com/xljufri/Launcher.git
   cd Launcher
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env.local` dan masukkan API Key Gemini Anda:
   ```bash
   cp .env.example .env.local
   ```
   Dapatkan API Key di [Google AI Studio](https://aistudio.google.com/).

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

---

## 📦 Build & Deployment

Untuk membuat versi produksi:
```bash
npm run build
```
Hasil build akan berada di folder `dist/`. Anda dapat mendeploy folder ini ke layanan hosting statis apa pun seperti **Vercel**, **Netlify**, atau **GitHub Pages**.

### Deploy Cepat ke Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxljufri%2FLauncher)

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI:** [Google Generative AI (Gemini)](https://ai.google.dev/)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

<div align="center">
Dibuat dengan ❤️ oleh <a href="https://github.com/xljufri">xljufri</a>
</div>

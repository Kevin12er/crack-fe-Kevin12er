# Crack Frontend

Platform pembelajaran online matematika yang dibangun dengan Next.js untuk mendukung proses belajar mengajar matematika antara guru dan siswa.

## Fitur Utama

- **Dashboard Guru**: Mengelola soal, melihat hasil siswa, dan mengelola materi pembelajaran
- **Dashboard Siswa**: Mengakses materi, mengerjakan latihan soal, dan melihat nilai
- **Autentikasi**: Sistem login dan registrasi untuk guru dan siswa
- **Manajemen Nilai**: Tracking hasil dan performa siswa

## Teknologi

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS 4
- **Form**: React Hook Form
- **Runtime**: Node.js

## Struktur Folder

```
src/
├── app/
│   ├── components/
│   │   ├── layout/          # Navbar dan Footer
│   │   └── ui/              # Komponen UI reusable (Card, Marquee)
│   ├── context/             # React Context (Auth)
│   ├── dashboard/           # Dashboard utama
│   │   ├── guru/            # Dashboard untuk guru
│   │   │   ├── components/  # FormTambahSoal, TabelHasilSiswa
│   │   │   ├── hasil/       # Halaman hasil siswa
│   │   │   ├── kelola-soal/ # Halaman kelola soal
│   │   │   └── materi/      # Halaman materi
│   │   └── siswa/           # Dashboard untuk siswa
│   │       ├── components/  # ContinueCard, ProgressCard, StatCards
│   │       ├── latihan-soal/# Halaman latihan soal
│   │       └── materi/      # Halaman materi
│   ├── login/               # Halaman login
│   ├── register/            # Halaman registrasi
│   ├── nilai/               # Halaman nilai
│   ├── pengaturan/          # Halaman pengaturan
│   ├── layout.jsx           # Root layout
│   ├── page.jsx             # Home page
│   └── globals.css          # Global styles
└── public/                  # Assets statis
```

## Memulai

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Jalankan development server**

   ```bash
   npm run dev
   ```

3. Buka [http://localhost:3000](http://localhost:3000) di browser

## Perintah Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm start` - Jalankan production server
- `npm run lint` - Jalankan linter

## Screenshot


### Hero Page
<p align="left">
    <img src="docs/images/HeroDesktop.png" alt="Tampilan hero desktop" width="700">
    <img src="docs/images/HeroMobile.png" alt="Tampilan hero desktop" width="250" height="500">
</p>

### Dashboard Siswa
<p align="left">
    <img src="docs/images/dashboardsiswa.png" alt="Tampilan hero desktop" width="700" height="450">
    <img src="docs/images/MobileDashboardSiswa.png" alt="Tampilan hero desktop" width="250" height="500">
</p>

### Dashboard Guru
<p align="left">
    <img src="docs/images/DashboardGuru.png" alt="Tampilan hero desktop" width="700">
    <img src="docs/images/MobiledashboardGuru.png" alt="Tampilan hero desktop" width="250" height="550">
</p>
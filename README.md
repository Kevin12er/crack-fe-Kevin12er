# Crack Frontend

Platform pembelajaran online matematika yang dibangun dengan Next.js untuk mendukung proses belajar mengajar matematika antara guru dan siswa.

##  Fitur Utama

- **Dashboard Guru (Instructor)**
  - Pengelolaan materi pembelajaran (*CRUD Course & Materials*).
  - Manajemen bank soal dan kuis interaktif.
  - Pemantauan (*tracking*) statistik hasil belajar dan nilai siswa.

- **Dashboard Siswa (Student)**
  - Akses modul pembelajaran dan materi interaktif.
  - Pengerjaan latihan soal dan kuis secara *real-time*.
  - Riwayat nilai dan laporan perkembangan belajar mandiri.

- **Autentikasi & Otorisasi (RBAC)**
  - Sistem Login dan Registrasi berbasis JWT (*JSON Web Token*).
  - Proteksi *route* berdasarkan *Role-Based Access Control* (Guru vs. Siswa).

- **Manajemen Nilai & Evaluasi**
  - Kalkulasi skor otomatis setelah pengerjaan kuis.
  - Laporan rekapitulasi performa dan riwayat evaluasi siswa.

## Teknologi

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS 4
- **Form**: React Hook Form
- **Runtime**: Node.js
- **Deploy**: Vercel

##  Struktur Folder Project

```text
src
├── app
│   ├── components
│   │   ├── layout
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   └── ui
│   │       ├── Card.jsx
│   │       └── Marquee.jsx
│   ├── context
│   │   └── authcontext.jsx
│   ├── courses
│   │   ├── [id]
│   │   │   └── page.jsx
│   │   └── page.jsx
│   ├── dashboard
│   │   ├── greeting.jsx
│   │   ├── guru
│   │   │   ├── components
│   │   │   │   ├── FormTambahSoal.jsx
│   │   │   │   └── TabelHasilSiswa.jsx
│   │   │   ├── hasil
│   │   │   │   └── page.jsx
│   │   │   ├── kelola-soal
│   │   │   │   └── page.jsx
│   │   │   ├── layout.jsx
│   │   │   ├── materi
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── sidebar.jsx
│   │   └── siswa
│   │       ├── components
│   │       │   ├── continuecard.jsx
│   │       │   ├── progresscard.jsx
│   │       │   └── statcards.jsx
│   │       ├── kuis
│   │       │   ├── [id]
│   │       │   │   └── page.jsx
│   │       │   └── page.jsx
│   │       ├── latihan-soal
│   │       │   └── page.jsx
│   │       ├── layout.jsx
│   │       ├── materi
│   │       │   ├── components
│   │       │   │   └── MateriCards.jsx
│   │       │   ├── [id]
│   │       │   │   └── page.jsx
│   │       │   └── page.jsx
│   │       ├── nilai
│   │       │   └── page.jsx
│   │       └── page.jsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.jsx
│   ├── login
│   │   └── page.jsx
│   ├── page.jsx
│   ├── pengaturan
│   │   └── page.jsx
│   └── register
│       └── page.jsx
└── lib
    └── api.js
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

## Live URL LearnBridge
[LearnBridge Website](https://crack-fe-kevin12er.vercel.app/)


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
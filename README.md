# Future Stock - Aplikasi Manajemen Stok Warung

Aplikasi web modern untuk manajemen stok warung dengan kemampuan prediksi penjualan masa depan menggunakan machine learning. Dibangun dengan Next.js, Tailwind CSS, dan dilengkapi dengan visualisasi data yang interaktif.

## 🚀 Fitur Utama

### 📊 Multi-Kategori Barang
- Tambah dan kelola berbagai jenis produk secara fleksibel
- Kategorisasi produk untuk organisasi yang lebih baik
- Manajemen produk dengan CRUD operations

### 📈 Input Data Historis
- Dashboard input untuk 12 bulan data penjualan terakhir
- Interface yang intuitif untuk memasukkan data bulanan
- Validasi data otomatis untuk akurasi

### 🤖 Mesin Prediksi Cerdas
- Menggunakan library `simple-statistics` untuk Regresi Linear
- Prediksi otomatis untuk 3 bulan ke depan
- Perhitungan akurasi dengan R-squared (R²)
- Analisis trend penjualan

### 📊 Visualisasi Data Interaktif
- Line Chart dari Recharts untuk visualisasi data
- Perbedaan visual antara data historis (garis solid) dan prediksi (garis putus-putus)
- Filter/dropdown untuk memilih produk yang dianalisis
- Tooltip interaktif dengan detail informasi

### 🎨 Desain Modern & Responsif
- Tema warna "Emerald & Slate" yang profesional
- Layout dashboard dengan Sidebar navigation
- Card-based layout untuk statistik
- Fully responsive di mobile dan desktop

### 🔔 Sistem Notifikasi
- Pop-up notification untuk setiap aksi
- Notifikasi sukses/error yang informatif
- Auto-close dengan opsi manual close

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Statistics**: simple-statistics
- **State Management**: React Context + LocalStorage
- **Language**: TypeScript

## 📁 Struktur Proyek

```
future-stock/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout dengan provider
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── chart/            # Chart components
│   │   └── SalesChart.tsx
│   ├── dashboard/        # Dashboard components
│   │   └── DashboardOverview.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── product/          # Product management
│   │   ├── ProductForm.tsx
│   │   └── ProductList.tsx
│   ├── ui/               # UI components
│   │   └── Notification.tsx
│   └── MainContent.tsx   # Main app component
├── context/              # React Context
│   └── StockContext.tsx
├── lib/                  # Utility functions
│   └── utils.ts
├── types/                # TypeScript types
│   └── index.ts
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, atau bun

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd future-stock
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. Run development server:
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

## 📖 Cara Penggunaan

### 1. Menambah Produk
- Klik "Tambah Produk" di sidebar
- Isi nama produk dan kategori
- Masukkan data penjualan 12 bulan terakhir
- Klik "Tambah Produk"

### 2. Melihat Analisis
- Pilih produk dari daftar
- Navigasi ke tab "Analisis"
- Lihat grafik penjualan dan prediksi
- Periksa detail prediksi dan akurasi

### 3. Dashboard Overview
- Lihat statistik keseluruhan di Dashboard
- Monitor produk terbaru dan terlaris
- Track total penjualan dan prediksi

## 🔧 Core Features

### Linear Regression Prediction
Aplikasi menggunakan Regresi Linear untuk memprediksi penjualan:
```typescript
const prediction = predictSales(historicalData)
// Returns: nextMonth, twoMonthsAhead, threeMonthsAhead, r2, slope, intercept
```

### State Management
Data persist menggunakan LocalStorage:
```typescript
// Product data
localStorage.setItem('future-stock-products', JSON.stringify(products))
// Selected product
localStorage.setItem('future-stock-selected-product', productId)
```

### Responsive Design
- Mobile-first approach
- Collapsible sidebar untuk mobile
- Adaptive grid layouts
- Touch-friendly interface

## 🎯 Algoritma Prediksi

Menggunakan **Linear Regression** dari library `simple-statistics`:
1. Input: Array data penjualan 12 bulan
2. Proses: Hitung garis regresi linear
3. Output: Prediksi 3 bulan ke depan
4. Validasi: Hitung R-squared untuk akurasi

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build untuk Production:
```bash
npm run build
npm start
```

### Deployment Options:
- **Vercel** (recommended)
- Netlify
- AWS Amplify
- Docker container

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail

## 📞 Support

Untuk pertanyaan atau support:
- Email: [email@example.com]
- Issues: [GitHub Issues](https://github.com/username/future-stock/issues)

---

**Future Stock** - Solusi cerdas untuk manajemen stok warung modern 🚀
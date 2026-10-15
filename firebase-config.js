// ==========================================
// CONFIGURASI UTAMA DAPIN CELINE
// ==========================================

// 1. DATA PEMBAYARAN & LOGO PAYMENT GATEWAY
const CONFIG_PEMBAYARAN = {
  namaAplikasi: "Dapin Celine",
  nomorWAAdmin: "6287793974131", // Format: 628xxx (Tanpa + atau spasi)
  
  // Rekening Deposit / Penarikan
  dana: {
    logoUrl: "dana.JPG",
    nomor: "083836338117",
    atasNama: "HABAN MUH**MAD QOLBY"
  },
  gopay: {
    logoUrl: "gopay.JPEG",
    nomor: "087793974131",
    atasNama: "KARRDIVA ZHO***N PRA***O"
  },
  qris: {
    logoUrl: "qrislogo.JPG",
    imageUrl: "qris.jpg", // Ganti dengan Gambar QRIS Anda
    atasNama: "DAPIN PINJAM"
  }
};

// 2. KONFIGURASI FIREBASE AUTH & FIRESTORE
const firebaseConfig = {
  apiKey: "AIzaSyCUwr8LW__m_vOx-D6lCwOP7GgZHUQBaak",
  authDomain: "dapin-celine.firebaseapp.com",
  projectId: "dapin-celine",
  storageBucket: "dapin-celine.firebasestorage.app",
  messagingSenderId: "273043558100",
  appId: "1:273043558100:web:d2475fa9c7330b1aef3541"
};

// 3. LOGIKA BIAYA DEPOSIT PENARIKAN (TIERED DEPOSIT)
function hitungBiayaDeposit(nominalPinjaman) {
  const nominal = parseFloat(nominalPinjaman);
  
  // Khusus di bawah Rp 1.000.000 -> Tepat 25%
  if (nominal < 1000000) {
    return nominal * 0.25;
  } 
  // Rp 1.000.000 s/d Rp 2.000.000 -> Rp 75.000
  else if (nominal >= 1000000 && nominal <= 2000000) {
    return 75000;
  } 
  // > Rp 2.000.000 s/d Rp 5.000.000 -> Rp 100.000
  else if (nominal > 2000000 && nominal <= 5000000) {
    return 100000;
  } 
  // > Rp 5.000.000 s/d Rp 10.000.000 -> Rp 150.000
  else if (nominal > 5000000 && nominal <= 10000000) {
    return 150000;
  } 
  // > Rp 10.000.000 s/d Rp 25.000.000 -> Rp 250.000
  else if (nominal > 10000000 && nominal <= 25000000) {
    return 250000;
  } 
  // > Rp 25.000.000 ke atas -> Rp 300.000
  else {
    return 300000;
  }
}

// 4. LOGIKA BUNGA FLAT 3% TOTAL (KESELURUHAN TENOR)
function hitungPinjaman(nominalPinjaman, tenorBulan) {
  const nominal = parseFloat(nominalPinjaman);
  const tenor = parseInt(tenorBulan);
  
  const totalBunga = nominal * 0.03; // Bunga 3% keseluruhan
  const totalPengembalian = nominal + totalBunga;
  const cicilanPerBulan = totalPengembalian / tenor;
  const depositFee = hitungBiayaDeposit(nominal);
  
  return {
    nominalPinjaman: nominal,
    tenor: tenor,
    bungaPersen: 3,
    totalBunga: totalBunga,
    totalPengembalian: totalPengembalian,
    cicilanPerBulan: cicilanPerBulan,
    biayaDeposit: depositFee
  };
}

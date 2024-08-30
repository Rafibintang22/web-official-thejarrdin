export const PengurusAkses = [
  {
    label: "Laporan",
    key: "/laporan",
    icon: "https://img.icons8.com/wired/64/ratings.png",
    iconColor: "https://img.icons8.com/fluency/100/ratings.png",
  },
  {
    label: "Masukan & Aspirasi",
    key: "/masukan&Aspirasi",
    icon: "https://img.icons8.com/ios/100/mailbox-closed-flag-down--v1.png",
    iconColor: "https://img.icons8.com/color/100/mailbox-opened-flag-down.png",
  },
  {
    label: "Pengumuman",
    key: "/pengumuman",
    icon: "https://img.icons8.com/ios/100/commercial.png",
    iconColor: "https://img.icons8.com/color/96/commercial.png",
  },
];

export const PengelolaAkses = [
  {
    label: "Tagihan Bulanan",
    key: "/tagihanbulanan",
    icon: "https://img.icons8.com/parakeet-line/96/bill.png",
    iconColor: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Pengumuman Pengelola",
    key: "/pengumumanpengelola",
    icon: "https://img.icons8.com/ios/100/megaphone.png",
    iconColor: "https://img.icons8.com/fluency/100/megaphone.png",
  },
  {
    label: "Informasi Paket",
    key: "/informasipaket",
    icon: "https://img.icons8.com/ios/100/new-product.png",
    iconColor: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
  {
    label: "Buletin Kegiatan",
    key: "/buletinkegiatan",
    icon: "https://img.icons8.com/ios/100/overtime--v1.png",
    iconColor: "https://img.icons8.com/isometric/100/overtime.png",
  },
];

export const PemilikUnitAkses = [
  {
    label: "Laporan",
    key: "/laporan",
    icon: "https://img.icons8.com/wired/64/ratings.png",
    iconColor: "https://img.icons8.com/fluency/100/ratings.png",
  },
  {
    label: "Tagihan Bulanan",
    key: "/tagihanbulanan",
    icon: "https://img.icons8.com/parakeet-line/96/bill.png",
    iconColor: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Masukan & Aspirasi",
    key: "/masukan&Aspirasi",
    icon: "https://img.icons8.com/ios/100/mailbox-closed-flag-down--v1.png",
    iconColor: "https://img.icons8.com/color/100/mailbox-opened-flag-down.png",
  },
  {
    label: "Pengumuman",
    key: "/pengumuman",
    icon: "https://img.icons8.com/ios/100/commercial.png",
    iconColor: "https://img.icons8.com/color/96/commercial.png",
  },
  {
    label: "Pengumuman Pengelola",
    key: "/pengumumanpengelola",
    icon: "https://img.icons8.com/ios/100/megaphone.png",
    iconColor: "https://img.icons8.com/fluency/100/megaphone.png",
  },
  {
    label: "Buletin Kegiatan",
    key: "/Buletinkegiatan",
    icon: "https://img.icons8.com/ios/100/overtime--v1.png",
    iconColor: "https://img.icons8.com/isometric/100/overtime.png",
  },
  {
    label: "Informasi Paket",
    key: "/informasipaket",
    icon: "https://img.icons8.com/ios/100/new-product.png",
    iconColor: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
];

export const PelakuKomersilAkses = [
  {
    label: "Laporan",
    key: "/laporan",
    icon: "https://img.icons8.com/wired/64/ratings.png",
    iconColor: "https://img.icons8.com/fluency/100/ratings.png",
  },
  {
    label: "Tagihan Bulanan",
    key: "/tagihanbulanan",
    icon: "https://img.icons8.com/parakeet-line/96/bill.png",
    iconColor: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Masukan & Aspirasi",
    key: "/masukan&Aspirasi",
    icon: "https://img.icons8.com/ios/100/mailbox-closed-flag-down--v1.png",
    iconColor: "https://img.icons8.com/color/100/mailbox-opened-flag-down.png",
  },
  {
    label: "Pengumuman",
    key: "/pengumuman",
    icon: "https://img.icons8.com/ios/100/commercial.png",
    iconColor: "https://img.icons8.com/color/96/commercial.png",
  },
  {
    label: "Pengumuman Pengelola",
    key: "/pengumumanpengelola",
    icon: "https://img.icons8.com/ios/100/megaphone.png",
    iconColor: "https://img.icons8.com/fluency/100/megaphone.png",
  },
  {
    label: "Buletin Kegiatan",
    key: "/Buletinkegiatan",
    icon: "https://img.icons8.com/ios/100/overtime--v1.png",
    iconColor: "https://img.icons8.com/isometric/100/overtime.png",
  },
  {
    label: "Informasi Paket",
    key: "/informasipaket",
    icon: "https://img.icons8.com/ios/100/new-product.png",
    iconColor: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
];

// Fungsi untuk menggabungkan akses berdasarkan role
// prameter roles bertipe array
export function multiRoleAkses(roles) {
  const roleAksesMapping = {
    Pengurus: PengurusAkses,
    Pengelola: PengelolaAkses,
    PemilikUnit: PemilikUnitAkses,
    PelakuKomersil: PelakuKomersilAkses,
  };

  // Gabungkan akses dari semua role yang diberikan
  const aksesGabungan = roles.flatMap((role) => roleAksesMapping[role] || []);

  // Hilangkan duplikasi berdasarkan label
  const aksesUnik = aksesGabungan.reduce((acc, current) => {
    const found = acc.find((item) => item.label === current.label);
    if (!found) {
      acc.push(current);
    }
    return acc;
  }, []);

  return aksesUnik;
}

export const bagiArrayAkses = (listAkses) => {
  const panjang = listAkses.length;
  const tengah = Math.ceil(panjang / 2);

  const bagianPertama = listAkses.slice(0, tengah);
  const bagianKedua = listAkses.slice(tengah);

  return [bagianPertama, bagianKedua];
};

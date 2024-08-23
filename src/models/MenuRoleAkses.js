export const PengurusAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: "https://img.icons8.com/color/100/mailbox-opened-flag-down.png",
  },
  {
    label: "Pengumuman",
    icon: "https://img.icons8.com/color/96/commercial.png",
  },
  {
    label: "Laporan",
    icon: "https://img.icons8.com/fluency/100/ratings.png",
  },
];

export const PengelolaAkses = [
  {
    label: "Tagihan Bulanan",
    icon: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Pengumuman Pengelola",
    icon: "https://img.icons8.com/fluency/100/megaphone.png",
  },
  {
    label: "Informasi Paket",
    icon: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
  {
    label: "Buletin Kegiatan",
    icon: "https://img.icons8.com/isometric/100/overtime.png",
  },
];

export const PemilikUnitAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: "https://img.icons8.com/color/100/mailbox-opened-flag-down.png",
  },
  {
    label: "Laporan",
    icon: "https://img.icons8.com/fluency/100/ratings.png",
  },
  {
    label: "Tagihan Bulanan",
    icon: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Pengumuman",
    icon: "https://img.icons8.com/color/96/commercial.png",
  },
  {
    label: "Informasi Paket",
    icon: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
  {
    label: "Buletin Kegiatan",
    icon: "https://img.icons8.com/isometric/100/overtime.png",
  },
];

export const PelakuKomersilAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: "https://img.icons8.com/color/96/mailbox-opened-flag-down.png",
  },
  {
    label: "Laporan",
    icon: "https://img.icons8.com/fluency/100/ratings.png",
  },
  {
    label: "Tagihan Bulanan",
    icon: "https://img.icons8.com/fluency/100/bill.png",
  },
  {
    label: "Pengumuman",
    icon: "https://img.icons8.com/color/96/commercial.png",
  },
  {
    label: "Informasi Paket",
    icon: "https://img.icons8.com/ultraviolet/100/new-product.png",
  },
  {
    label: "Buletin Kegiatan",
    icon: "https://img.icons8.com/isometric/100/overtime.png",
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

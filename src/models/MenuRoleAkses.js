import {
  faBriefcase,
  faBullhorn,
  faHandHoldingHeart,
  faTruckRampBox,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

export const PengurusAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: faHandHoldingHeart,
  },
  {
    label: "Pengumuman",
    icon: faBullhorn,
  },
  {
    label: "Laporan",
    icon: faFileLines,
  },
];

export const PengelolaAkses = [
  {
    label: "Tagihan Bulanan",
    icon: faWallet,
  },
  {
    label: "Pengumuman",
    icon: faBullhorn,
  },
  {
    label: "Informasi Paket",
    icon: faTruckRampBox,
  },
  {
    label: "Buletin Kegiatan",
    icon: faBriefcase,
  },
];

export const PemilikUnitAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: faHandHoldingHeart,
  },
  {
    label: "Laporan",
    icon: faFileLines,
  },
  {
    label: "Tagihan Bulanan",
    icon: faWallet,
  },
  {
    label: "Pengumuman",
    icon: faBullhorn,
  },
  {
    label: "Informasi Paket",
    icon: faTruckRampBox,
  },
  {
    label: "Buletin Kegiatan",
    icon: faBriefcase,
  },
];

export const PelakuKomersilAkses = [
  {
    label: "Masukan & Aspirasi",
    icon: faHandHoldingHeart,
  },
  {
    label: "Laporan",
    icon: faFileLines,
  },
  {
    label: "Tagihan Bulanan",
    icon: faWallet,
  },
  {
    label: "Pengumuman",
    icon: faBullhorn,
  },
  {
    label: "Informasi Paket",
    icon: faTruckRampBox,
  },
  {
    label: "Buletin Kegiatan",
    icon: faBriefcase,
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

  let bagianPertama = [];
  let bagianKedua = [];

  // JIKA PANJANG arr GENAP maka
  if (panjang % 2 === 0) {
    bagianPertama = listAkses.slice(0, tengah + 1);
    bagianKedua = listAkses.slice(tengah + 1);
  } else {
    bagianPertama = listAkses.slice(0, tengah);
    bagianKedua = listAkses.slice(tengah);
  }

  return [bagianPertama, bagianKedua];
};

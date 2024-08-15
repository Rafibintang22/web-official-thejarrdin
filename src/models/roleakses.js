import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    img: <FontAwesomeIcon icon={faHandHoldingHeart} size="2xl" />,
  },
  {
    label: "Pengumuman",
    img: <FontAwesomeIcon icon={faBullhorn} size="2xl" />,
  },
  {
    label: "Laporan",
    img: <FontAwesomeIcon icon={faFileLines} size="2xl" />,
  },
];

export const PengelolaAkses = [
  {
    label: "Tagihan Bulanan",
    img: <FontAwesomeIcon icon={faWallet} size="2xl" />,
  },
  {
    label: "Pengumuman",
    img: <FontAwesomeIcon icon={faBullhorn} size="2xl" />,
  },
  {
    label: "Informasi Paket",
    img: <FontAwesomeIcon icon={faTruckRampBox} size="2xl" />,
  },
  {
    label: "Buletin Kegiatan",
    img: <FontAwesomeIcon icon={faBriefcase} size="2xl" />,
  },
];

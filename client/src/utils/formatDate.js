function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Mengubah string date menjadi object Date
  const date = new Date(dateString);

  // Mendapatkan hari, bulan, dan tahun
  const day = date.getDate();
  const month = months[date.getMonth()]; // Bulan dimulai dari 0, jadi kita ambil dari array months
  const year = date.getFullYear();

  // Mengembalikan format yang diinginkan
  return `${day} ${month} ${year}`;
}

// Contoh penggunaan
//   console.log(formatDate("2024-09-16")); // Output: 16 Sept 2024

export default formatDate;

import { create } from "zustand";

const sortDataController = create((set) => ({
  currSort: "",
  setCurrSort: (curr) => set({ currSort: curr }),
}));

const sortDataTable = (data, key, ascending = true) => {
  return data.sort((a, b) => {
    let comparison = 0;

    if (key === "TglDibuat") {
      // Compare dates (convert to Date objects)
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);
      comparison = dateA - dateB;
    } else {
      // For string comparison (Judul and DibuatOleh)
      comparison = a[key].localeCompare(b[key]);
    }

    // Return sorted data in ascending or descending order
    return ascending ? comparison : -comparison;
  });
};

export { sortDataTable, sortDataController };

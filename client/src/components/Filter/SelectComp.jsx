import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function SelectComp() {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 250 }} size="small" className="select-filter">
        <InputLabel id="demo-simple-select-autowidth-label">Sort: Berdasarkan</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          // value={Sort: Berdasarkan}
          // onChange={handleChange}
          autoWidth
          label="Sort: Berdasarkan"
          MenuProps={{
            sx: {
              "&& .Mui-selected": {
                background: "#39905237",
              },
            },
          }}
        >
          <MenuItem value="">
            <em>Tidak ada</em>
          </MenuItem>
          <MenuItem value={"Judul"}>Judul</MenuItem>
          <MenuItem value={"Dibuat oleh"}>Dibuat oleh</MenuItem>
          <MenuItem value={"Tanggal dibuat"}>Tanggal dibuat</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectComp;

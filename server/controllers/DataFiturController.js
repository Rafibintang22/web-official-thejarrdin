const {
  DataFiturRepository,
  FiturRepository,
  PenggunaRepository,
} = require("../database/repositories");
const { sendNotifToWa } = require("../utils/sendWa");
const { uploadFileGdrive, createFolder } = require("../utils/uploadFileGdrive");
const { Validator } = require("../utils/validator");

class DataFiturController {
  static async getAll(req, res) {
    const { FiturID, Tipe, StartDate, EndDate } = req.params;
    // // PAGINATION SERVER
    // const CurrPage = req.params.CurrPage;
    // const PageSize = req.params.PageSize;
    // const offset = (CurrPage - 1) * PageSize; // Hitung offset berdasarkan current page
    // const limit = parseInt(PageSize, 10); // Batasi jumlah data yang diambil berdasarkan pageSize
    // //END PAGINATION SERVER

    const UserID = req.dataSession.UserID;

    // console.log(tipe);

    try {
      if (Tipe === "untukUser") {
        const readFiturUntukuser = await DataFiturRepository.readAllByFiturIdUntukUser(
          UserID,
          FiturID,
          StartDate,
          EndDate
          // offset,
          // limit
        );
        return res.status(200).json(readFiturUntukuser);
      }

      if (Tipe === "dibuatUser") {
        const readFiturDibuatUser = await DataFiturRepository.readAllByFiturIdDibuatUser(
          UserID,
          FiturID,
          StartDate,
          EndDate
          // offset,
          // limit
        );
        return res.status(200).json(readFiturDibuatUser);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getOne(req, res) {
    const DataFiturID = req.params.DataFiturID;

    try {
      const readOneDataFitur = await DataFiturRepository.readOne(DataFiturID);

      return res.status(200).json(readOneDataFitur);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async post(req, res) {
    const { body, files } = req;

    // Determine UserTujuan based on TipeTujuan
    let userTujuan;
    if (body.TipeTujuan === "individu") {
      // If individu, parse UserTujuan from body as individual IDs
      userTujuan = body.UserTujuan.split(",").map((id) => Number(id));
    } else if (body.TipeTujuan === "group") {
      // If group, fetch user IDs by roles
      const roleIds = body.UserTujuan.split(",").map((id) => Number(id));
      try {
        const usersByRole = await Promise.all(
          roleIds.map(async (roleId) => {
            const users = await PenggunaRepository.readAllUserByRole(roleId);
            return users.map((user) => user.UserID); // Assuming UserID is the identifier
          })
        );
        // Flatten the nested arrays and remove duplicates
        userTujuan = [...new Set(usersByRole.flat())];
      } catch (error) {
        return res.status(500).json({ error: "Error fetching users by role." });
      }
    }

    let dataFitur = {
      Judul: body.Judul,
      FiturID: Number(body.FiturID),
      TglDibuat: Number(body.TglDibuat),
      UserID_dibuat: req.dataSession.UserID,
      UserTujuan: userTujuan, // Set UserTujuan based on TipeTujuan
      FileFolder: body.FileFolder || [],
    };
    // console.log(dataFitur, "DATA FITUR");

    const readFitur = await FiturRepository.readOne(dataFitur.FiturID);
    const judul = dataFitur.Judul; // Get the title

    let linkFiles = ""; //berupa string
    let arrDataUser = [];
    // // JIKA post terdapat files
    if (files && files.FileFolder) {
      // Fetch user emails from PenggunaRepository
      let userIds = dataFitur.UserTujuan;
      userIds.push(dataFitur.UserID_dibuat); //menambah juga userID untuk yg buat data
      try {
        arrDataUser = await Promise.all(
          userIds.map(async (id) => {
            const user = await PenggunaRepository.readOne(id);
            return {
              pengguna_id: user ? user.pengguna_id : null,
              nama: user ? user.nama : null,
              no_telp: user ? user.no_telp : null,
              email: user ? user.email : null,
            };
          })
        );
      } catch (error) {
        return res.status(500).json({ error: "Error fetching data user." });
      }
      // console.log(arrDataUser);
      // END Fetch user emails from PenggunaRepository

      // membuat folder berdasarkan nama fitur_judul
      const namaFolder = `${readFitur.nama}_${judul}`;
      const folderId = await createFolder(namaFolder);
      try {
        for (let i = 0; i < files.FileFolder.length; i++) {
          console.log(`Uploading file: ${files.FileFolder[i].originalname}`);
          const dataFile = await uploadFileGdrive(files.FileFolder[i], arrDataUser, folderId);
          const url = `https://drive.google.com/file/d/${dataFile.id}/view`; //link dari file pada gdrive
          if (i === files.FileFolder.length - 1) {
            linkFiles += url;
          } else {
            linkFiles += url + ",";
          }
        }
      } catch (error) {
        console.error(`Error uploading file: ${error}`);
        return res.status(500).send(`Error uploading file: ${error.message}`);
      }
      console.log(linkFiles);
      dataFitur = {
        ...dataFitur,
        FileFolder: linkFiles,
      };
    }

    // Validasi data dari request body yang ingin di create
    let { error } = Validator.createDataFitur(dataFitur);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const createDataFitur = await DataFiturRepository.create(dataFitur);
      // Filter array untuk menghapus data pembuat data
      arrDataUser = arrDataUser.filter((user) => user.pengguna_id !== dataFitur.UserID_dibuat);
      await sendNotifToWa(arrDataUser, readFitur.nama);
      return res.status(201).json({ success: true, data: createDataFitur });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleteDataFitur = await DataFiturRepository.delete(req.params.DataFiturID);

      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { DataFiturController };

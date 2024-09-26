const {
  DataFiturRepository,
  FiturRepository,
  UserRepository,
} = require("../database/repositories");
const { uploadFileGdrive, createFolder } = require("../utils/uploadFileGdrive");
const { Validator } = require("../utils/validator");

class DataFiturController {
  static async getAll(req, res) {
    const FiturID = req.params.FiturID;
    const Tipe = req.params.Tipe;
    const UserID = req.dataSession.UserID;

    // console.log(tipe);

    try {
      if (Tipe === "untukUser") {
        const readFiturUntukuser = await DataFiturRepository.readAllByFiturIdUntukUser(
          UserID,
          FiturID
        );
        return res.status(200).json(readFiturUntukuser);
      }

      if (Tipe === "dibuatUser") {
        const readFiturDibuatUser = await DataFiturRepository.readAllByFiturIdDibuatUser(
          UserID,
          FiturID
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
    const UserID = req.dataSession.UserID;

    try {
      const readOneDataFitur = await DataFiturRepository.readOne(UserID, DataFiturID);

      return res.status(200).json(readOneDataFitur);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async post(req, res) {
    const { body, files } = req;
    let dataFitur = {
      ...body,
      FiturID: Number(body.FiturID),
      TglDibuat: Number(body.TglDibuat),
      UserID_dibuat: Number(body.UserID_dibuat),
      UserTujuan: body.UserTujuan.split(",").map((id) => Number(id)), // Convert IDs to numbers
      FileFolder: body.FileFolder || [],
    };
    // console.log(dataFitur);

    const readFitur = await FiturRepository.readOne(dataFitur.FiturID);
    const judul = dataFitur.Judul; // Get the title

    let linkFiles = ""; //berupa string
    // // JIKA post terdapat files
    if (files && files.FileFolder) {
      // Fetch user emails from UserRepository
      let userIds = dataFitur.UserTujuan;
      userIds.push(dataFitur.UserID_dibuat); //menambah juga userID untuk yg buat data
      let arrEmailUser = [];
      try {
        arrEmailUser = await Promise.all(
          userIds.map(async (id) => {
            const user = await UserRepository.readOne(id);
            return user ? user.email : null; // Assuming user has an 'email' field
          })
        );
      } catch (error) {
        return res.status(500).json({ error: "Error fetching user emails." });
      }
      // console.log(arrEmailUser);
      // END Fetch user emails from UserRepository

      // membuat folder berdasarkan nama fitur_judul
      const namaFolder = `${readFitur.nama}_${judul}`;
      const folderId = await createFolder(namaFolder);
      try {
        for (let i = 0; i < files.FileFolder.length; i++) {
          console.log(`Uploading file: ${files.FileFolder[i].originalname}`);
          const dataFile = await uploadFileGdrive(files.FileFolder[i], arrEmailUser, folderId);
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
      return res.status(201).json({ success: true, data: createDataFitur });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleteDataFitur = await DataFiturRepository.delete(req.params.dataFiturID);

      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { DataFiturController };

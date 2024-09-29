const {
  MessageRepository,
  UserRoleRepository,
  UserRepository,
} = require("../database/repositories");
const { uploadFileGdrive, createFolder } = require("../utils/uploadFileGdrive");
const { Validator } = require("../utils/validator");

class MessageController {
  static async getAll(req, res) {
    const Tipe = req.params.Tipe;
    const UserID = req.dataSession.UserID;

    try {
      if (Tipe === "untukUser") {
        const readAspirasi = await MessageRepository.readAllByPenerimaID(UserID);
        return res.status(200).json(readAspirasi);
      }

      if (Tipe === "dibuatUser") {
        const readAspirasi = await MessageRepository.readAllByPengirimID(UserID);
        return res.status(200).json(readAspirasi);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getOne(req, res) {
    const PesanID = req.params.PesanID;
    const UserID = req.dataSession.UserID;

    try {
      const readOneMessage = await MessageRepository.readOne(UserID, PesanID);

      return res.status(200).json(readOneMessage);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async post(req, res) {
    const { body, files } = req;
    // console.log(body, files);

    let dataMessage = {
      ...body,
      TglDibuat: Number(body.TglDibuat),
      UserID_dibuat: Number(body.UserID_dibuat),
    };

    let userIds = await UserRoleRepository.readAllPengurusID();
    userIds.push({ userID: dataMessage.UserID_dibuat }); //menambah juga userID untuk user yg membuat data
    const judul = dataMessage.Judul;
    let linkFiles = ""; //berupa string
    console.log(files);

    // // JIKA post terdapat files
    if (files && files.PesanFile) {
      // Fetch user emails from UserRepository
      let arrEmailUser = [];
      try {
        arrEmailUser = await Promise.all(
          userIds.map(async (user) => {
            const readUser = await UserRepository.readOne(user.userID);
            return readUser ? readUser.email : null; // Assuming user has an 'email' field
          })
        );
      } catch (error) {
        return res.status(500).json({ error: "Error fetching user emails." });
      }
      // console.log(arrEmailUser);
      // END Fetch user emails from UserRepository

      // membuat folder berdasarkan nama fitur_judul
      const namaFolder = `Masukan&Aspirasi_${judul}`;
      const folderId = await createFolder(namaFolder);
      try {
        for (let i = 0; i < files.PesanFile.length; i++) {
          console.log(`Uploading file: ${files.PesanFile[i].originalname}`);
          const dataFile = await uploadFileGdrive(files.PesanFile[i], arrEmailUser, folderId);
          const url = `https://drive.google.com/file/d/${dataFile.id}/view`; //link dari file pada gdrive
          if (i === files.PesanFile.length - 1) {
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
      dataMessage = {
        ...dataMessage,
        PesanFile: linkFiles,
      };
    }

    dataMessage = {
      ...dataMessage,
      AllPengurusID: userIds,
    };

    // Validasi data dari request body yang ingin di create
    let { error } = Validator.createMessage(dataMessage);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const createMessage = await MessageRepository.create(dataMessage);
      return res.status(201).json({ success: true, data: createMessage });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateRead(req, res) {
    const { MessageID } = req.body;
    const UserID = req.dataSession.UserID;

    try {
      const updateMessage = await MessageRepository.updateRead(MessageID, UserID);
      return res.status(201).json({ success: true, data: updateMessage });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { MessageController };

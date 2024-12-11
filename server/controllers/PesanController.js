const {
  PesanRepository,
  PenggunaRoleRepository,
  PenggunaRepository,
} = require("../database/repositories");
const { sendNotificationsWa } = require("../utils/sendWa");
const { uploadFileGdrive, createFolder } = require("../utils/uploadFileGdrive");
const { Validator } = require("../utils/validator");

class PesanController {
  static async getAll(req, res) {
    const Tipe = req.params.Tipe;
    const StartDate = req.params.StartDate;
    const EndDate = req.params.EndDate;
    const UserID = req.dataSession.UserID;

    try {
      if (Tipe === "untukUser") {
        const readAspirasi = await PesanRepository.readAllByPenerimaID(UserID, StartDate, EndDate);
        return res.status(200).json(readAspirasi);
      }

      if (Tipe === "dibuatUser") {
        const readAspirasi = await PesanRepository.readAllByPengirimID(UserID, StartDate, EndDate);
        return res.status(200).json(readAspirasi);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getOne(req, res) {
    const PesanID = req.params.PesanID;
    const Tipe = req.params.Tipe;
    const UserID = req.dataSession.UserID;

    console.log("Fetching message with ID:", PesanID, "for user:", UserID);

    try {
      const readOneMessage = await PesanRepository.readOne(UserID, PesanID, Tipe);
      // console.log("Fetched message:", readOneMessage);

      return res.status(200).json(readOneMessage);
    } catch (error) {
      // console.error("Error fetching data:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  static async post(req, res) {
    const { body, files } = req;
    // console.log(body, files);

    const isReply = body.UserTujuanID ? true : false;
    let dataMessage = {
      ...body,
      UserTujuanID: Number(body.UserTujuanID),
      TglDibuat: Number(body.TglDibuat),
      UserID_dibuat: req.dataSession.UserID,
    };

    // console.log(body, dataMessage, isReply);

    let userIds = [];
    // KALAU BUKAN REPLY, maka ambil semua idPengurus
    if (!isReply) {
      userIds = await PenggunaRoleRepository.readAllPengurusID();
      // console.log(userIds);
    } else {
      // KALAU REPLY, maka yg di push adalah id user tujuan saja
      userIds.push({ pengguna_id: dataMessage.UserTujuanID });
    }
    userIds.push({ pengguna_id: dataMessage.UserID_dibuat }); //menambah juga pengguna_id untuk user yg membuat data
    const judul = dataMessage.Judul;
    let linkFiles = ""; //berupa string
    // console.log(files);

    // console.log(userIds);

    // // JIKA post terdapat files
    let arrDataUser = [];
    if (files && files.PesanFile) {
      // Fetch user emails from PenggunaRepository
      try {
        arrDataUser = await Promise.all(
          userIds.map(async (user) => {
            console.log(user);

            const readUser = await PenggunaRepository.readOne(user.pengguna_id);
            return {
              nama: readUser ? readUser.nama : null,
              no_telp: readUser ? readUser.no_telp : null,
              email: readUser ? readUser.email : null,
            };
          })
        );
      } catch (error) {
        return res.status(500).json({ error: "Error fetching user emails." });
      }
      // console.log(arrDataUser);
      // END Fetch user emails from PenggunaRepository

      // membuat folder berdasarkan nama fitur_judul
      const namaFolder = `Masukan&Aspirasi_${judul}`;
      const folderId = await createFolder(namaFolder);
      try {
        for (let i = 0; i < files.PesanFile.length; i++) {
          console.log(`Uploading file: ${files.PesanFile[i].originalname}`);
          const dataFile = await uploadFileGdrive(files.PesanFile[i], arrDataUser, folderId);
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

    // Menghapus atribut UserTujuanID
    const { UserTujuanID, ...newDataMessage } = dataMessage;

    // Tambahkan AllPengurusID ke dalam objek baru tanpa UserTujuanID
    dataMessage = {
      ...newDataMessage,
      AllPengurusID: userIds,
    };

    // Validasi data dari request body yang ingin di create
    let { error } = Validator.createMessage(dataMessage, isReply);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const createMessage = await PesanRepository.create(dataMessage);
      await sendNotificationsWa(arrDataUser, "Masukan & Aspirasi");
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
      const updateMessage = await PesanRepository.updateRead(MessageID, UserID);
      return res.status(201).json(updateMessage);
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { PesanController };

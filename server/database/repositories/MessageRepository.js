const { DatabaseManager } = require("../../config/DatabaseManager");
const { MessageModel, UserRoleModel, UserModel, MessageTujuanModel } = require("../models");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class MessageRepository {
  static async readAllByPenerimaID(penerimaID) {
    try {
      const findMessage = await MessageTujuanModel.findAll({
        where: { penerimaID: penerimaID },
        include: [
          { model: UserModel, required: true, raw: true },
          {
            model: MessageModel,
            required: true,
            raw: true,
            include: [{ model: UserModel, required: true, raw: true }],
          },
        ],
      });

      const transformedData = findMessage.map((msg) => ({
        Id: msg.messageID,
        Judul: msg.Message.judul,
        DibuatOleh: msg.Message.User.nama,
        TglDibuat: msg.Message.tglDibuat,
      }));

      // return findMessage;
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async readAllByPengirimID(pengirimID) {
    try {
      const findMessage = await MessageModel.findAll({
        where: { pengirimID: pengirimID },
        include: [
          { model: UserModel, required: true, raw: true },
          {
            model: MessageTujuanModel,
            required: true,
            raw: true,
            include: [{ model: UserModel, required: true, raw: true }],
          },
        ],
      });

      const transformedData = findMessage.map((msg) => ({
        Id: msg.messageID,
        Judul: msg.judul,
        DibuatOleh: msg.User.nama,
        TglDibuat: msg.tglDibuat,
      }));

      // return findMessage;
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(userID, messageID) {
    try {
      let findMessage = await MessageModel.findOne({
        where: { messageID: messageID },
        include: [
          { model: UserModel, required: true },
          { model: MessageTujuanModel, where: { penerimaID: userID }, required: true },
        ],
      });
      // console.log(findMessage);

      if (!findMessage) {
        const newError = new Error("Data tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      const transformedData = {
        Judul: findMessage.judul,
        TglDibuat: findMessage.tglDibuat,
        DibuatOleh: findMessage.User.nama,
        Pesan: findMessage.messageText,
        IsRead: findMessage.message_tujuans[0].isRead,
        File: findMessage.fileFolder,
      };

      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async create(dataInsert) {
    const transaction = await jarrdinDB.transaction();

    try {
      const { Judul, TglDibuat, UserID_dibuat, Pesan, PesanFile, AllPengurusID } = dataInsert;
      if (!Judul || !TglDibuat || !UserID_dibuat || !Pesan) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      const newMessage = await MessageModel.create(
        {
          fiturID: 8, //8 adalah ID Fitur Aspirasi
          pengirimID: UserID_dibuat,
          judul: Judul,
          messageText: Pesan,
          messageFile: PesanFile,
          tglDibuat: new Date(TglDibuat),
        },
        { transaction }
      );

      // console.log(AllPengurusID);

      // Filter to hapus UserID_dibuat dari UserTujuan if ada
      const filteredUserTujuan = AllPengurusID.filter((user) => user.userID !== UserID_dibuat);
      const messageID = newMessage.messageID;

      const messageTujuanRecords = filteredUserTujuan.map((user) => ({
        messageID: messageID,
        penerimaID: user.userID, // Pastikan ini adalah integer, bukan instance
      }));

      //   console.log(messageTujuanRecords, "TUJUAN");

      await MessageTujuanModel.bulkCreate(messageTujuanRecords, { transaction });

      await transaction.commit();

      return newMessage;
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating Message:", error);
      throw error;
    }
  }

  static async updateRead(messageID, userID) {
    // console.log(messageID, userID);

    try {
      let messageTujuan = await MessageTujuanModel.findOne({
        where: { messageID: messageID, penerimaID: userID },
        raw: true,
      });

      //jika isRead True
      if (messageTujuan.isRead === 1) {
        return await MessageTujuanModel.update(
          { isRead: false, tglDibaca: null },
          { where: { messageID: messageID, penerimaID: userID } }
        );
      } else {
        //Jika isread false
        return await MessageTujuanModel.update(
          { isRead: true, tglDibaca: new Date() },
          { where: { messageID: messageID, penerimaID: userID } }
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { MessageRepository };

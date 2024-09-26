const { DatabaseManager } = require("../../config/DatabaseManager");
const { MessageModel, UserRoleModel, UserModel, MessageTujuanModel } = require("../models");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class MessageRepository {
  static async create(dataInsert) {
    const transaction = await jarrdinDB.transaction();

    try {
      const { Judul, TglDibuat, UserID_dibuat, Pesan, PesanFile } = dataInsert;
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

      let allPengurusID;
      allPengurusID = await UserRoleModel.findAll({
        where: { roleID: 1 }, //roleID 1 merupakan id pengurus
        attributes: ["userID"], // mengambil kolom userID saja
        raw: true,
      });

      // Filter to hapus UserID_dibuat dari UserTujuan if ada
      const filteredUserTujuan = allPengurusID.filter((user) => user.userID !== UserID_dibuat);
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

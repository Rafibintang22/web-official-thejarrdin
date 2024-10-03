const { DatabaseManager } = require("../../config/DatabaseManager");
const { MessageModel, UserModel, MessageTujuanModel } = require("../models");
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
        FiturID: 8, //no fiturID untuk masukan & aspirasi
        Judul: msg.Message.judul,
        DibuatOleh: msg.Message.User.nama,
        TglDibuat: msg.Message.tglDibuat,
        IsRead: msg.isRead,
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
        // IsRead: msg.isRead,
      }));

      // return findMessage;
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(userID, messageID, tipeRead) {
    try {
      let findMessage;

      if (tipeRead === "untukUser") {
        findMessage = await MessageModel.findOne({
          where: { messageID: messageID },
          include: [
            { model: UserModel, required: true },
            { model: MessageTujuanModel, where: { penerimaID: userID }, required: true },
          ],
        });

        if (!findMessage) {
          const newError = new Error("Data tidak ditemukan.");
          newError.status = 404;
          throw newError;
        }

        const transformedData = {
          Id: findMessage.messageID,
          Judul: findMessage.judul,
          TglDibuat: findMessage.tglDibuat,
          DibuatOleh: { UserID: findMessage.User.userID, Nama: findMessage.User.nama },
          Pesan: findMessage.messageText,
          IsRead: findMessage.message_tujuans[0].isRead,
          File: findMessage.messageFile,
        };

        return transformedData;
      } else if (tipeRead === "dibuatUser") {
        findMessage = await MessageModel.findOne({
          where: { messageID: messageID, pengirimID: userID },
          include: [
            { model: UserModel, required: true },
            {
              model: MessageTujuanModel,
              required: true,
              include: { model: UserModel, required: true },
            },
          ],
        });

        if (!findMessage) {
          const newError = new Error("Data tidak ditemukan.");
          newError.status = 404;
          throw newError;
        }

        const transformedData = {
          Id: findMessage.messageID,
          Judul: findMessage.judul,
          TglDibuat: findMessage.tglDibuat,
          DibuatOleh: { UserID: findMessage.User.userID, Nama: findMessage.User.nama },
          Pesan: findMessage.messageText,
          // UserTujuan: findMessage.message_tujuans.map((msg) => ({
          //   UserID: msg.User.userID,
          //   Nama: msg.User.nama,
          // })),
          UserTujuan: findMessage.message_tujuans.map((msg) => msg.User.nama),
          File: findMessage.messageFile,
        };

        return transformedData;
      }

      // console.log(findMessage);
    } catch (error) {
      throw error;
    }
  }

  // static async readOneWithReplies(messageID) {
  //   try {
  //     const findMessage = await MessageModel.findOne({
  //       where: { messageID },
  //       include: [
  //         {
  //           model: MessageModel,
  //           as: "replies", // Self-referencing association
  //           include: {
  //             model: UserModel,
  //           },
  //         },
  //         { model: UserModel },
  //       ],
  //     });

  //     if (!findMessage) {
  //       const newError = new Error("Data tidak ditemukan.");
  //       newError.status = 404;
  //       throw newError;
  //     }

  //     const transformedData = {
  //       Id: findMessage.messageID,
  //       Judul: findMessage.judul,
  //       TglDibuat: findMessage.tglDibuat,
  //       DibuatOleh: findMessage.User.nama,
  //       Pesan: findMessage.messageText,
  //       // IsRead: findMessage.message_tujuans[0].isRead,
  //       File: findMessage.messageFile,
  //     };

  //     return transformedData;

  //     // return findMessage;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  static async create(dataInsert, isReply) {
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

  static async replyMessage(dataMessage) {
    const transaction = await jarrdinDB.transaction();
    try {
      const { OriginalMessageID, Judul, TglDibuat, Pesan, UserID_dibuat, PesanFile } = dataMessage;
      if (!Judul || !TglDibuat || !Pesan) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      // Create the reply message
      const replyMessage = await MessageModel.create({
        fiturID: 8, //8 adalah ID Fitur Aspirasi
        pengirimID: UserID_dibuat, // ID of the user replying
        parentMessageID: OriginalMessageID, // ID of the original message
        judul: "RE: " + dataMessage.Judul, // Prefix with "RE:" to indicate a reply
        messageText: dataMessage.Pesan,
        messageFile: dataMessage.PesanFile,
        tglDibuat: new Date(TglDibuat),
      });

      // BUAT MESSAGE ISREAD MENJADI DIBACA
      let messageTujuan = await MessageTujuanModel.findOne({
        where: { messageID: OriginalMessageID, penerimaID: UserID_dibuat },
        raw: true,
      });

      let responseUpdate;
      //jika isRead True
      if (messageTujuan.isRead === 1) {
        responseUpdate = await MessageTujuanModel.update(
          { isRead: false, tglDibaca: null },
          { where: { messageID: OriginalMessageID, penerimaID: UserID_dibuat } }
        );
      } else {
        //Jika isread false
        responseUpdate = await MessageTujuanModel.update(
          { isRead: true, tglDibaca: new Date() },
          { where: { messageID: OriginalMessageID, penerimaID: UserID_dibuat } }
        );
      }

      if (!responseUpdate) {
        const newError = new Error("Error update isRead");
        newError.status = 500;
        throw newError;
      }

      await transaction.commit();

      return replyMessage;
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
        await MessageTujuanModel.update(
          { isRead: false, tglDibaca: null },
          { where: { messageID: messageID, penerimaID: userID } }
        );

        return { IsRead: false };
      } else {
        //Jika isread false
        await MessageTujuanModel.update(
          { isRead: true, tglDibaca: new Date() },
          { where: { messageID: messageID, penerimaID: userID } }
        );

        return { IsRead: true };
      }
    } catch (error) {
      throw error;
    }
  }
  static async updateRead2(messageID, userID) {
    // console.log(messageID, userID);

    try {
      await MessageTujuanModel.update(
        { isRead: true, tglDibaca: new Date() },
        { where: { messageID: messageID, penerimaID: userID } }
      );

      return { IsRead: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { MessageRepository };

const { DataFiturRepository, MessageRepository } = require("../database/repositories");

class NotifikasiController {
  static async getAll(req, res) {
    const UserID = req.dataSession.UserID;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    try {
      const readDataMasuk = await DataFiturRepository.readAllUntukUser(UserID);
      const readMsgMasuk = await MessageRepository.readAllByPenerimaID(UserID);

      let unreadCount = 0;

      // Filter and map data for DataFitur with Tipe set to 'Fitur'
      const filteredDataMasuk = readDataMasuk
        .filter((data) => {
          const isUnread = data.IsRead === false;
          const isInTimeRange = new Date(data.TglDibuat) >= oneMonthAgo;
          if (isUnread) unreadCount++; // Count unread items
          return isInTimeRange || isUnread;
        })
        .map((data) => ({
          ...data,
          Tipe: "Fitur", // Add Tipe as 'Fitur'
        }));

      // Filter and map data for Messages with Tipe set to 'Pesan'
      const filteredMsgMasuk = readMsgMasuk
        .filter((msg) => {
          const isUnread = msg.IsRead === false;
          const isInTimeRange = new Date(msg.TglDibuat) >= oneMonthAgo;
          if (isUnread) unreadCount++; // Count unread items
          return isInTimeRange || isUnread;
        })
        .map((msg) => ({
          ...msg,
          Tipe: "Pesan", // Add Tipe as 'Pesan'
        }));

      const readNotifikasi = [...filteredDataMasuk, ...filteredMsgMasuk];

      //sort berdasarkan desc berd tgldibuat
      readNotifikasi.sort((a, b) => new Date(b.TglDibuat) - new Date(a.TglDibuat));

      return res.status(200).json({ Notif: readNotifikasi, TotalUnRead: unreadCount });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateIsRead(req, res) {
    const UserID = req.dataSession.UserID;
    const { Tipe, Id } = req.body;

    // console.log(UserID, Tipe, Id);

    try {
      let updateRespon;
      if (Tipe === "Fitur") {
        updateRespon = await DataFiturRepository.updateIsRead(UserID, Id);
      }

      if (Tipe === "Pesan") {
        updateRespon = await MessageRepository.updateRead2(Id, UserID);
      }
      return res.status(201).json(updateRespon);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { NotifikasiController };

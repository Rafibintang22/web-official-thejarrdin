const { DataFiturModel, UserTujuanModel, UserModel } = require("../models");
const { DatabaseManager } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class DataFiturRepository {
  static async readAllUntukUser(userID) {
    try {
      let findDataFitur;
      findDataFitur = await UserModel.findAll({
        where: { userID: userID },
        include: [
          {
            model: UserTujuanModel,
            required: true,
            include: [
              {
                model: DataFiturModel,
                required: true,
                include: [
                  {
                    model: UserModel,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!findDataFitur || !findDataFitur.length === 0 || !findDataFitur[0]?.user_tujuans) {
        return [];
      }

      const transformedData = findDataFitur[0]?.user_tujuans.map((data) => ({
        Id: data.DataFitur.dataFiturID,
        FiturID: data.DataFitur.fiturID,
        Judul: data.DataFitur.judul,
        DibuatOleh: data.DataFitur.User.nama,
        TglDibuat: data.DataFitur.tglDibuat,
        IsRead: data.isRead,
      }));

      // Mengurutkan berdasarkan isRead dan TglDibuat
      transformedData.sort((a, b) => {
        // Urutkan berdasarkan isRead, 1 (dibaca) akan muncul sebelum 0 (belum dibaca)
        if (a.IsRead === b.IsRead) {
          // Jika isRead sama, urutkan berdasarkan TglDibuat terbaru
          return new Date(b.TglDibuat) - new Date(a.TglDibuat);
        }
        return a.IsRead - b.IsRead; // Mengurutkan berdasarkan isRead, 1 lebih besar dari 0
      });

      return transformedData;

      // return findDataFitur;
    } catch (error) {
      throw error;
    }
  }
  static async readAllByFiturIdUntukUser(userID, fiturID) {
    try {
      let findDataFitur;
      findDataFitur = await UserModel.findAll({
        where: { userID: userID },
        include: [
          {
            model: UserTujuanModel,
            required: true,
            include: [
              {
                model: DataFiturModel,
                required: true,
                where: { fiturID: fiturID },
                include: [
                  {
                    model: UserModel,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!findDataFitur || !findDataFitur.length === 0 || !findDataFitur[0]?.user_tujuans) {
        return [];
      }

      const transformedData = findDataFitur[0]?.user_tujuans.map((data) => ({
        Id: data.DataFitur.dataFiturID,
        Judul: data.DataFitur.judul,
        DibuatOleh: data.DataFitur.User.nama,
        TglDibuat: data.DataFitur.tglDibuat,
      }));

      // Mengurutkan berdasarkan TglDibuat terbaru
      transformedData.sort((a, b) => new Date(b.TglDibuat) - new Date(a.TglDibuat));
      return transformedData;

      // return findDataFitur;
    } catch (error) {
      throw error;
    }
  }
  static async readAllByFiturIdDibuatUser(userID, fiturID) {
    try {
      let findDataFitur;
      findDataFitur = await UserModel.findAll({
        where: { userID: userID },
        include: [
          {
            model: DataFiturModel,
            required: true,
            where: { fiturID: fiturID },
            include: [
              {
                model: UserModel,
                required: true,
              },
            ],
          },
        ],
      });

      if (!findDataFitur || !findDataFitur.length === 0 || !findDataFitur[0]?.DataFiturs) {
        return [];
      }

      const transformedData = findDataFitur[0]?.DataFiturs.map((data) => ({
        Id: data.dataFiturID,
        Judul: data.judul,
        DibuatOleh: data.User.nama,
        TglDibuat: data.tglDibuat,
      }));

      // Mengurutkan berdasarkan TglDibuat terbaru
      transformedData.sort((a, b) => new Date(b.TglDibuat) - new Date(a.TglDibuat));

      return transformedData;

      // PAGINATION SERVER
      // // Dapatkan DataFiturs dari hasil query
      // const dataFiturs = findDataFitur[0]?.DataFiturs || [];

      // // Sorting berdasarkan tglDibuat (dari terbaru ke terlama)
      // const sortedData = dataFiturs.sort((a, b) => new Date(b.tglDibuat) - new Date(a.tglDibuat));

      // const lengthData = sortedData.length;
      // // Manual pagination di sini
      // const paginatedData = sortedData.slice(offset, offset + limit); // Lakukan pagination manual pada sortedData

      // const transformedData = {
      //   total: lengthData,
      //   row: paginatedData.map((data) => ({
      //     Id: data.dataFiturID,
      //     Judul: data.judul,
      //     DibuatOleh: data.User.nama,
      //     TglDibuat: data.tglDibuat,
      //   })),
      // };

      // return transformedData;
      // END PAGINATION SERVER

      // return findDataFitur;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(dataFiturID) {
    try {
      let findDataFitur;

      findDataFitur = await DataFiturModel.findOne({
        where: { dataFiturID: dataFiturID },
        include: [
          {
            model: UserModel, // Include untuk user pembuat data
            attributes: ["nama"], // Ambil hanya nama pembuat
          },
          {
            model: UserTujuanModel, // Include untuk user tujuan
            required: false, // Jika ada, ambil data UserTujuan
            include: [
              {
                model: UserModel, // Include data dari UserModel di dalam UserTujuan
                attributes: ["nama"], // Ambil nama user tujuan
              },
            ],
          },
        ],
      });
      if (!findDataFitur) {
        const newError = new Error("Data tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      // Transform the data to the desired format
      const transformedData = {
        Judul: findDataFitur.judul,
        TglDibuat: findDataFitur.tglDibuat,
        DibuatOleh: findDataFitur.User.nama,
        UserTujuan: findDataFitur.user_tujuans.map((tujuan) => tujuan.User.nama),
        File: findDataFitur.fileFolder,
      };

      return transformedData;
      // return findDataFitur;
    } catch (error) {
      throw error;
    }
  }

  static async create(dataInsert) {
    const transaction = await jarrdinDB.transaction();
    try {
      const { FiturID, Judul, TglDibuat, UserID_dibuat, FileFolder, UserTujuan } = dataInsert;

      if (
        !FiturID ||
        !Judul ||
        !TglDibuat ||
        !UserID_dibuat ||
        !FileFolder ||
        !UserTujuan ||
        !Array.isArray(UserTujuan)
      ) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      const newDataFitur = await DataFiturModel.create(
        {
          fiturID: FiturID,
          judul: Judul,
          tglDibuat: new Date(TglDibuat),
          userID_dibuat: UserID_dibuat,
          fileFolder: FileFolder,
        },
        { transaction }
      );

      // Filter to hapus UserID_dibuat dari UserTujuan if ada
      const filteredUserTujuan = UserTujuan.filter((userID) => userID !== UserID_dibuat);

      const userTujuanRecords = filteredUserTujuan.map((userID) => ({
        dataFiturID: newDataFitur.dataFiturID,
        userID,
      }));

      await UserTujuanModel.bulkCreate(userTujuanRecords, { transaction });

      await transaction.commit();

      return newDataFitur;
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating DataFitur:", error);
      throw error;
    }
  }

  // Fungsi delete untuk menghapus dataFitur beserta relasi di UserTujuanModel
  static async delete(dataFiturID) {
    const transaction = await jarrdinDB.transaction();
    try {
      // Cari apakah dataFiturID ada
      const dataFitur = await DataFiturModel.findOne({
        where: { dataFiturID },
        include: [UserTujuanModel],
      });

      if (!dataFitur) {
        throw new Error("DataFitur not found.");
      }

      // Hapus relasi dari UserTujuanModel terlebih dahulu
      await UserTujuanModel.destroy({
        where: { dataFiturID },
        transaction,
      });

      // Hapus data dari DataFiturModel
      await DataFiturModel.destroy({
        where: { dataFiturID },
        transaction,
      });

      // Commit transaksi setelah berhasil
      await transaction.commit();

      return { success: true, message: "DataFitur deleted successfully." };
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting DataFitur:", error);
      throw error;
    }
  }

  static async updateIsRead(userID, dataFiturID) {
    try {
      await UserTujuanModel.update(
        {
          isRead: true,
        },
        { where: { userID: userID, dataFiturID: dataFiturID } }
      );
      return { IsRead: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { DataFiturRepository };

const { DataFiturModel, UserTujuanModel, UserModel } = require("../models");
const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class DataFiturRepository {
  static async readAllByFiturID(userID, fiturID) {
    try {
      const findDataFitur = await UserModel.findAll({
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
              },
            ],
          },
        ],
      });

      if (!findDataFitur) {
        return [];
      }

      const transformedData = findDataFitur[0].user_tujuans.map((data) => ({
        Judul: data.DataFitur.judul,
        DibuatOleh: data.DataFitur.userID_dibuat,
        TglDibuat: data.DataFitur.tglDibuat,
        File: data.DataFitur.fileFolder,
      }));

      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async create(dataInsert) {
    const transaction = await jarrdinDB.transaction();
    try {
      const { fiturID, judul, tglDibuat, userID_dibuat, fileFolder, userTujuan } = dataInsert;

      if (
        !fiturID ||
        !judul ||
        !tglDibuat ||
        !userID_dibuat ||
        !fileFolder ||
        !userTujuan ||
        !Array.isArray(userTujuan)
      ) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      const newDataFitur = await DataFiturModel.create(
        {
          fiturID,
          judul,
          tglDibuat,
          userID_dibuat,
          fileFolder,
        },
        { transaction }
      );

      const userTujuanRecords = userTujuan.map((userID) => ({
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
}

module.exports = { DataFiturRepository };

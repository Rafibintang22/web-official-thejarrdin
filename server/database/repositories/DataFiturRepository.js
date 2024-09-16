const { DataFiturModel, UserTujuanModel, UserModel } = require("../models");
const { DatabaseManager } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class DataFiturRepository {
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
        Judul: data.DataFitur.judul,
        DibuatOleh: data.DataFitur.User.nama,
        TglDibuat: data.DataFitur.tglDibuat,
        File: data.DataFitur.fileFolder,
      }));

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
        Judul: data.judul,
        DibuatOleh: data.User.nama,
        TglDibuat: data.tglDibuat,
        File: data.fileFolder,
      }));

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

      const userTujuanRecords = UserTujuan.map((userID) => ({
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

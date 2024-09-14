const { LoginSessionModel } = require("../models");
const { DatabaseManager } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class LoginSessionRepository {
  static async readAll() {
    try {
      const findLoginSession = await LoginSessionModel.findAll();

      return findLoginSession;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(loginSessionID) {
    try {
      const findLoginSession = await LoginSessionModel.findOne({
        where: { loginSessionID: loginSessionID },
      });

      if (!findLoginSession) {
        const newError = new Error("loginSession tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      return findLoginSession;
    } catch (error) {
      throw error;
    }
  }

  static async create(dataInsert) {
    const transaction = await jarrdinDB.transaction();
    try {
      const { email, noTelp, otp, activeTime, isActive } = dataInsert;

      //   EMAIL ATAU NOTELP YANG DIISI
      if ((!email && !noTelp) || !otp || !activeTime || !isActive) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      const newDataLoginSession = await LoginSessionModel.create(
        {
          email,
          noTelp,
          otp,
          activeTime,
          isActive,
        },
        { transaction }
      );

      await transaction.commit();

      return newDataLoginSession;
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating DataFitur:", error);
      throw error;
    }
  }

  static async updateIsActive(loginSessionID, isActive) {
    try {
      return await LoginSessionModel.update({ isActive }, { where: { loginSessionID } });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { LoginSessionRepository };

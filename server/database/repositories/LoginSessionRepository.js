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

  static async readOne(otp, email, noTelp) {
    try {
      const findLoginSession = await LoginSessionModel.findOne({
        where: { otp: otp, email: email, noTelp: noTelp },
      });

      if (!findLoginSession) {
        const newError = new Error("otp tidak ditemukan.");
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
      const { email, noTelp, otp } = dataInsert;
      //   console.log(email, noTelp, otp);

      //   EMAIL ATAU NOTELP YANG DIISI
      if ((!email && !noTelp) || !otp) {
        throw new Error("Data yang diperlukan tidak lengkap.");
      }

      const newDataLoginSession = await LoginSessionModel.create(
        {
          email,
          noTelp,
          otp,
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

  static async updateToken(loginSessionID, token) {
    try {
      return await LoginSessionModel.update(
        { token: token },
        { where: { loginSessionID: loginSessionID } }
      );
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const findLoginSession = await LoginSessionModel.findOne({
        where: { loginSessionID: id },
      });

      if (!findLoginSession) {
        const newError = new Error("loginSessionID tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }
      //   console.log(findLoginSession);

      const deleteLoginSession = await LoginSessionModel.destroy({
        where: { loginSessionID: findLoginSession.loginSessionID },
      });

      return deleteLoginSession;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { LoginSessionRepository };

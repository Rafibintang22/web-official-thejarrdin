const { UserModel } = require("../models");

class UserRepository {
  static async readAll() {
    try {
      const findUser = await UserModel.findAll();

      return findUser;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(userID) {
    try {
      const findUser = await UserModel.findOne({
        where: { userID: userID },
      });

      if (!findUser) {
        const newError = new Error("User tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      return findUser;
    } catch (error) {
      throw error;
    }
  }

  static async readExisting(identifier) {
    try {
      const finsUser = await UserModel.findOne({
        where: identifier.includes("@") ? { Email: identifier } : { noTelp: identifier },
        raw: true,
      });

      return finsUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { UserRepository };

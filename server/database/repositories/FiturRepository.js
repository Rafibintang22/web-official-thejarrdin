const { FiturModel } = require("../models/index");

const { DatabaseManager, Sequelize, Op } = require("../../config/DatabaseManager");

class FiturRepository {
  static async readAll() {
    try {
      const findFitur = await FiturModel.findAll();

      return findFitur;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(fiturID) {
    try {
      const findFitur = await FiturModel.findOne({
        where: { fiturID: fiturID },
      });

      if (!findFitur) {
        const newError = new Error("fitur tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      return findFitur;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { FiturRepository };

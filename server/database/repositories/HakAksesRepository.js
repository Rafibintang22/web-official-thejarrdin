const { HakAksesModel, RoleModel, FiturModel, UserRoleModel, UserModel } = require("../models");

class HakAksesRepository {
  static async readAll() {
    try {
      const findHakAkses = await HakAksesModel.findAll();

      return findHakAkses;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { HakAksesRepository };

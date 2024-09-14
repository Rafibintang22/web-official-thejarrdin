const { RoleModel } = require("../models");

class RoleRepository {
  static async readAll() {
    try {
      const findRole = await RoleModel.findAll();

      return findRole;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(roleID) {
    try {
      const findRole = await RoleModel.findOne({
        where: { roleID: roleID },
      });

      if (!findRole) {
        const newError = new Error("Role tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      return findRole;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { RoleRepository };

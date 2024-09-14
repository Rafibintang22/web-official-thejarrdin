const { UserRoleRepository } = require("../database/repositories");

class UserRoleController {
  static async getAllByUserID(req, res) {
    try {
      let readFitur = await UserRoleRepository.readRoleByUserID(1);
      res.status(200).json(readFitur);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { UserRoleController };

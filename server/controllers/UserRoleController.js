const { UserRoleRepository, UserRepository } = require("../database/repositories");

class UserRoleController {
  static async getAllByUserID(req, res) {
    const dataSesssion = req.dataSession;
    // console.log(dataSesssion);

    try {
      let readFitur = await UserRoleRepository.readRoleByUserID(dataSesssion.UserID);
      res.status(200).json({ Role: readFitur });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { UserRoleController };

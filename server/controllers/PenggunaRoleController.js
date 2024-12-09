const { PenggunaRoleRepository } = require("../database/repositories");

class PenggunaRoleController {
  static async getAllByUserID(req, res) {
    const dataSesssion = req.dataSession;
    // console.log(dataSesssion);

    try {
      let readFitur = await PenggunaRoleRepository.readRoleByUserID(dataSesssion.UserID);
      res.status(200).json({ Role: readFitur });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { PenggunaRoleController };

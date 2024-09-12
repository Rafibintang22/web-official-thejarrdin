const { HakAksesRepository } = require("../database/repositories/HakAksesRepository");

class HakAksesController {
  static async getByUserID(req, res) {
    const userID = req.params.userID;
    try {
      let readHakAkses = await HakAksesRepository.readFiturByUserID(userID);
      res.status(200).json(readHakAkses);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { HakAksesController };

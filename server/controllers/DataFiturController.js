const { DataFiturRepository } = require("../database/repositories");
const { Validator } = require("../utils/validator");

class DataFiturController {
  static async getAll(req, res) {
    const fiturID = req.params.fiturID;
    const tipe = req.params.tipe;
    const userID = req.dataSession.UserID;

    // console.log(tipe);

    try {
      if (tipe === "untukUser") {
        const readFiturUntukuser = await DataFiturRepository.readAllByFiturIdUntukUser(
          userID,
          fiturID
        );
        return res.status(200).json(readFiturUntukuser);
      }

      if (tipe === "dibuatUser") {
        const readFiturDibuatUser = await DataFiturRepository.readAllByFiturIdDibuatUser(
          userID,
          fiturID
        );
        return res.status(200).json(readFiturDibuatUser);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async post(req, res) {
    // Validasi data dari request body yang ingin di create
    let { error } = Validator.createDataFitur(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const createDataFitur = await DataFiturRepository.create(req.body);
      return res.status(201).json({ success: true, data: createDataFitur });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleteDataFitur = await DataFiturRepository.delete(req.params.dataFiturID);

      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { DataFiturController };

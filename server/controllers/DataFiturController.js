const { DataFiturRepository } = require("../database/repositories");
const { Validator } = require("../utils/validator");
const { DataFiturSchema } = require("../utils/validator/DataFiturSchema");

class DataFiturController {
  static async getAll(req, res) {
    const fiturID = req.params.fiturID;
    const userID = 3;

    try {
      const readFitur = await DataFiturRepository.readAllByFiturID(userID, fiturID);
      if (!readFitur || readFitur.length === 0) {
        return res.status(404).json({ error: "No data found for the given fiturID" });
      }

      return res.status(200).json(readFitur);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async post(req, res) {
    // Validasi data dari request body yang ingin di create
    let { error } = DataFiturSchema.createDataFitur(req.body);

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

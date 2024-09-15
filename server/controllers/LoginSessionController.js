const { LoginSessionRepository } = require("../database/repositories/LoginSessionRepository");

class LoginSessionController {
  static async getOne(req, res) {
    try {
      let readLoginSession = await LoginSessionRepository.readOne(req.params.id);
      res.status(200).json(readLoginSession);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async createLoginSession(email, noTelp, otp) {
    try {
      const loginSessionData = {
        email,
        noTelp,
        otp,
        entryTime: new Date().getTime(), // Set waktu masuk
        isActive: false, // Set sebagai false, karena otp belum digunakan
      };

      // Simpan session login ke database
      const newLoginSession = await LoginSessionRepository.create(loginSessionData);

      return newLoginSession;
    } catch (error) {
      throw new Error("Error creating login session: " + error.message);
    }
  }
}

module.exports = { LoginSessionController };

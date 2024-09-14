const { LoginSessionRepository } = require("../database/repositories/LoginSessionRepository");

class LoginSessionController {
  static async getOne(loginSessionID) {
    try {
      let readLoginSession = await LoginSessionRepository.readOne(loginSessionID);
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
        activeTime: new Date(), // Set waktu aktif sekarang
        isActive: true, // Set sebagai aktif
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

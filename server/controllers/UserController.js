const { UserRepository } = require("../database/repositories");
const { LoginSessionRepository } = require("../database/repositories/LoginSessionRepository");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtpToEmail } = require("../utils/sendEmail");
const { Validator } = require("../utils/validator");
const { LoginSessionController } = require("./LoginSessionController");
const OTP_EXPIRATION_TIME = 300000; // 5 menit (300.000 ms)

class UserController {
  static async getAll(req, res) {
    try {
      let readUser = await UserRepository.readAll();
      res.status(200).json(readUser);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async getOne(req, res) {
    try {
      let readUser = await UserRepository.readOne(req.params.id);
      res.status(200).json(readUser);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async postLogin(req, res) {
    try {
      const { User } = req.body;

      const { error } = Validator.loginUser(User);
      if (error) {
        const newError = new Error(error.details[0].message);
        newError.status = 400;
        throw newError;
      }

      const readUser = await UserRepository.readExisting(User.Email ? User.Email : User.NoTelp);
      if (!readUser) {
        //JIka user tidak ditemukan
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const identifier = readUser.email ? readUser.email : readUser.noTelp;
      const otp = generateOtp(identifier);
      // Simpan session login di database

      const loginSession = await LoginSessionController.createLoginSession(
        readUser.email,
        readUser.noTelp,
        otp
      );
      if (loginSession && readUser.email && User.Email) {
        await sendOtpToEmail(readUser.email, otp);
      }

      res.status(200).json({ success: true, data: { User: readUser, Otp: otp } });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { LoginSessionID, Otp } = req.body; // Klien mengirimkan loginSessionID dan OTP

      if (!LoginSessionID || !Otp) {
        return res.status(400).json({ error: "Login session ID and OTP are required" });
      }

      // Temukan session login berdasarkan LoginSessionID
      const loginSession = await LoginSessionRepository.readOne(LoginSessionID);

      if (!loginSession) {
        return res.status(401).json({ error: "Invalid login session ID" });
      }

      // Cek apakah OTP masih aktif
      const currentTime = new Date().getTime();
      const otpCreationTime = new Date(loginSession.entryTime).getTime();

      // Periksa apakah waktu aktif sudah melewati batas yang diizinkan
      if (currentTime - otpCreationTime > OTP_EXPIRATION_TIME) {
        return res.status(401).json({ error: "OTP has expired" });
      }

      // Cocokkan OTP
      if (loginSession.otp !== Otp) {
        return res.status(401).json({ error: "Invalid OTP" });
      }

      // Set isActive menjadi true karena OTP sudah digunakan
      loginSession.isActive = true;
      await loginSession.save(); // Simpan perubahan ke database
      // Jika OTP valid dan masih aktif
      res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { UserController };

const { UserRepository } = require("../database/repositories");
const { LoginSessionRepository } = require("../database/repositories/LoginSessionRepository");
const { Authorization } = require("../utils/Authorization");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtpToEmail } = require("../utils/sendEmail");
const { Validator } = require("../utils/validator");
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
        return res.status(401).json({ error: "email atau no telepon yang dimasukan salah" });
      }

      const identifier = readUser.email ? readUser.email : readUser.noTelp;
      const otp = generateOtp(identifier);
      // Simpan session login di database

      // console.log(readUser, "READUSER");

      const loginSession = await LoginSessionRepository.create({
        userID: readUser.UserID,
        email: readUser.Email,
        noTelp: readUser.NoTelp,
        otp: otp,
      });
      if (loginSession && readUser.Email && User.Email) {
        await sendOtpToEmail(readUser.Email, otp);
      }

      res.status(200).json({ success: true, data: { User: readUser } });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { Otp, Email, NoTelp } = req.body; // Klien mengirimkan EMail, MoTelp, dan OTP

      if ((!Email && !NoTelp) || !Otp) {
        return res.status(400).json({ error: "OTP are required OR Email & No Telepon undefined" });
      }

      // Temukan session login berdasarkan otp,email,noTelp
      const loginSession = await LoginSessionRepository.readOne(Otp, Email, NoTelp);

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

      const readUser = await UserRepository.readExisting(loginSession.email);

      const payload = {
        UserID: readUser.UserID,
        Email: readUser.Email,
        NoTelp: readUser.NoTelp,
        Otp: loginSession.otp,
        loginSessionID: loginSession.loginSessionID,
      };

      // Jika OTP valid dan masih aktif
      const token = await Authorization.encryption(payload);
      res.set("authorization", `Bearer ${token}`);

      // Memasukan token ke database
      LoginSessionRepository.updateToken(loginSession.loginSessionID, token);

      res.status(200).json({ success: true, message: "Login successful", data: readUser });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async getUserSession(req, res) {
    try {
      if (!req.dataSession) {
        const newError = new Error("Access denied.");
        newError.status = 403;
        throw newError;
      }

      const sessionData = req.dataSession;

      res.status(200).json({ status: "authorized", dataLogin: sessionData });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const dataSession = req.dataSession;
      // delete loginSession
      const loginSession = await LoginSessionRepository.delete(dataSession.loginSessionID);

      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { UserController };

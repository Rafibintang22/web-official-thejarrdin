const jwt = require("jsonwebtoken");
const { PenggunaRepository, SesiMasukRepository } = require("../database/repositories");
const { Authorization } = require("../utils/Authorization");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtpToEmail } = require("../utils/sendEmail");
const { sendOtpToWa } = require("../utils/sendWa");
const { Validator } = require("../utils/validator");
const OTP_EXPIRATION_TIME = 300000; // 5 menit (300.000 ms)

class PenggunaController {
    static async getAll(req, res) {
        try {
            let readUser = await PenggunaRepository.readAll();
            res.status(200).json(readUser);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getOne(req, res) {
        const UserID = req.params.UserID;

        try {
            let readUser = await PenggunaRepository.readOne(UserID);
            console.log(readUser);

            res.status(200).json(readUser);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async patch(req, res) {
        try {
            const { User } = req.body;

            const { error } = Validator.updateUser(User);
            if (error) {
                const newError = new Error(error.details[0].message);
                newError.status = 400;
                throw newError;
            }

            const patchUser = await PenggunaRepository.update(User);
            res.status(200).json({
                success: true,
                data: { User: patchUser },
            });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const UserID = req.params.UserID;
            console.log(UserID);

            const deletedUser = await PenggunaRepository.delete(UserID);
            res.status(200).json({
                success: true,
                data: { User: deletedUser },
            });
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

            const readUser = await PenggunaRepository.readExisting(User.Email || User.NoTelp);
            if (!readUser) {
                //JIka user tidak ditemukan
                return res
                    .status(401)
                    .json({ error: "email atau no telepon yang dimasukan salah" });
            }

            const identifier = readUser.Email || readUser.NoTelp;
            const otp = generateOtp(identifier);
            // Simpan session login di database

            // console.log(readUser, "READUSER");

            const loginSession = await SesiMasukRepository.create({
                pengguna_id: readUser.UserID,
                email: readUser.Email,
                no_telp: readUser.NoTelp,
                otp: otp,
            });
            if (loginSession && readUser.Email && User.Email) {
                await sendOtpToEmail(readUser.Email, otp);
            }

            if (loginSession && readUser.NoTelp && User.NoTelp) {
                await sendOtpToWa(readUser.Nama, readUser.NoTelp, otp);
            }

            res.status(200).json({
                success: true,
                // sebelum integrasi ke WA API (jika no_telp maka otp akan di kirim ke client)
                data: { User: readUser },
            });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async postRegister(req, res) {
        try {
            const { User } = req.body;

            const { error } = Validator.registerUser(User);
            if (error) {
                const newError = new Error(error.details[0].message);
                newError.status = 400;
                throw newError;
            }
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async verifyOtp(req, res) {
        try {
            const { Otp, Email, NoTelp } = req.body; // Klien mengirimkan EMail, MoTelp, dan OTP

            if ((!Email && !NoTelp) || !Otp) {
                return res.status(400).json({ error: "Isi OTP terlebih dahulu" });
            }

            // Temukan session login berdasarkan otp,email,no_telp
            const loginSession = await SesiMasukRepository.readOne(Otp, Email, NoTelp);

            if (!loginSession) {
                return res.status(401).json({ error: "Kode otp yang anda masukan salah" });
            }

            // Cek apakah OTP masih aktif
            const currentTime = new Date().getTime();
            const otpCreationTime = new Date(loginSession.wkt_masuk).getTime();

            // Periksa apakah waktu aktif sudah melewati batas yang diizinkan
            if (currentTime - otpCreationTime > OTP_EXPIRATION_TIME) {
                return res.status(401).json({ error: "Kode otp sudah kadaluwarsa" });
            }

            // Cocokkan OTP
            if (loginSession.otp !== Otp) {
                return res.status(401).json({ error: "Kode otp yang anda masukan salah" });
            }

            const readUser = await PenggunaRepository.readExisting(
                loginSession.email || loginSession.no_telp
            );

            const payload = {
                UserID: readUser.UserID,
                Email: readUser.Email,
                NoTelp: readUser.NoTelp,
                Role: readUser.Role,
                Otp: loginSession.otp,
                LoginSessionID: loginSession.sesi_id,
            };

            // Jika OTP valid dan masih aktif
            const token = await Authorization.encryption(payload);
            res.set("authorization", `Bearer ${token}`);

            // Memasukan token ke database
            SesiMasukRepository.updateToken(loginSession.sesi_id, token);

            res.status(200).json({ success: true, message: "Login successful", data: readUser });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getUserSession(req, res) {
        const token = req.headers["authorization"];
        try {
            let readSession = await SesiMasukRepository.readToken(token);
            if (!readSession) {
                return res.status(401).json({ message: "Sesi anda telah berakhir" });
            }

            //cek apakah expired menggunakan jwt.verify
            const secretKey = process.env.SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);

            const { iat, exp, Otp, LoginSessionID, ...rest } = decoded;
            const sessionData = {
                ...rest,
            };
            // console.log(sessionData);

            res.status(200).json({ status: "authorized", dataLogin: sessionData });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const dataSession = req.dataSession;
            console.log(dataSession, "dataSession");
            // delete loginSession
            const loginSession = await SesiMasukRepository.delete(dataSession.LoginSessionID);

            res.status(200).json({ success: true, message: "Logout successful" });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = { PenggunaController };

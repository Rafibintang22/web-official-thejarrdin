const express = require("express");
const {
    FiturController,
    DataFiturController,
    PenggunaRoleController,
    PenggunaController,
    PesanController,
    NotifikasiController,
    RoleController,
} = require("./controllers");
const { Authorization } = require("./utils/Authorization");
const multer = require("multer");
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}); // Atur multer sesuai kebutuhan

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", Authorization.decryption, FiturController.getAllByUserID);

// ###############################################################################
//                              USER
router.get(
    "/user",
    Authorization.decryption,
    Authorization.checkRole(["Admin"]),
    PenggunaController.getAll
);
router.get("/user/session", Authorization.decryption, PenggunaController.getUserSession);
router.get(
    "/user/:UserID",
    Authorization.decryption,
    Authorization.checkRole(["Admin"]),
    PenggunaController.getOne
);
router.patch(
    "/user",
    Authorization.decryption,
    Authorization.checkRole(["Admin"]),
    PenggunaController.patch
);
router.delete(
    "/user",
    Authorization.decryption,
    Authorization.checkRole(["Admin"]),
    PenggunaController.delete
);
router.post("/login", PenggunaController.postLogin);
router.post("/login/verify-otp", PenggunaController.verifyOtp);
router.get("/logout", Authorization.decryption, PenggunaController.logout);

// ###############################################################################
//                              ROLE
router.get("/role", Authorization.decryption, RoleController.getAll);
router.get("/role/:UserID", Authorization.decryption, PenggunaRoleController.getAllByUserID);

// ###############################################################################
//                              DATA FITUR
router.get(
    // "/data/:FiturID/:Tipe/:CurrPage/:PageSize",
    "/data/:FiturID/:Tipe/:StartDate/:EndDate",
    Authorization.decryption,
    DataFiturController.getAll
);
router.get("/data/:DataFiturID", Authorization.decryption, DataFiturController.getOne);
router.post(
    "/data",
    upload.fields([{ name: "FileFolder", maxCount: 10 }]),
    Authorization.decryption,
    DataFiturController.post
);
router.delete("/data/:DataFiturID", Authorization.decryption, DataFiturController.delete);

// ###############################################################################
//                              MESSAGE ASPIRASI
router.get("/aspirasi/:Tipe/:StartDate/:EndDate", Authorization.decryption, PesanController.getAll);
router.get("/aspirasidetail/:PesanID/:Tipe", Authorization.decryption, PesanController.getOne);
router.post(
    "/aspirasi",
    upload.fields([{ name: "PesanFile", maxCount: 10 }]),
    Authorization.decryption,
    PesanController.post
);
router.patch("/aspirasi", Authorization.decryption, PesanController.updateRead);
module.exports = { router };
// ###############################################################################
//                              NOTIFIKASI
router.get("/notif", Authorization.decryption, NotifikasiController.getAll);
router.patch("/notif", Authorization.decryption, NotifikasiController.updateIsRead);

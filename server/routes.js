const express = require("express");
const {
  FiturController,
  DataFiturController,
  UserRoleController,
  UserController,
  MessageController,
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
router.get("/user", Authorization.decryption, UserController.getAll);
router.get("/user/session", Authorization.decryption, UserController.getUserSession);
router.post("/login", UserController.postLogin);
router.post("/login/verify-otp", UserController.verifyOtp);
router.get("/logout", Authorization.decryption, UserController.logout);

// ###############################################################################
//                              ROLE
router.get("/role", Authorization.decryption, UserRoleController.getAllByUserID);

// ###############################################################################
//                              DATA FITUR
router.get(
  // "/data/:FiturID/:Tipe/:CurrPage/:PageSize",
  "/data/:FiturID/:Tipe",
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
router.get("/aspirasi/:Tipe", Authorization.decryption, MessageController.getAll);
router.get("/aspirasi/detail/:PesanID", Authorization.decryption, MessageController.getOne);
router.post(
  "/aspirasi",
  upload.fields([{ name: "PesanFile", maxCount: 10 }]),
  Authorization.decryption,
  MessageController.post
);
router.patch("/aspirasi", Authorization.decryption, MessageController.updateRead);
module.exports = { router };

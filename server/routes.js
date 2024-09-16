const express = require("express");
const {
  FiturController,
  DataFiturController,
  UserRoleController,
  UserController,
} = require("./controllers");
const { Authorization } = require("./utils/Authorization");

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
router.get("/data/:fiturID/:tipe", Authorization.decryption, DataFiturController.getAll);
router.post("/data", Authorization.decryption, DataFiturController.post);
router.delete("/data/:dataFiturID", Authorization.decryption, DataFiturController.delete);

module.exports = { router };

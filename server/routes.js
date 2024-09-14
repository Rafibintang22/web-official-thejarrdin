const express = require("express");
const {
  FiturController,
  DataFiturController,
  UserRoleController,
  UserController,
} = require("./controllers");

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", FiturController.getAllByUserID);

// ###############################################################################
//                              USER
router.post("/login", UserController.postLogin);

// ###############################################################################
//                              ROLE
router.get("/role", UserRoleController.getAllByUserID);

// ###############################################################################
//                              DATA FITUR
router.get("/data/:fiturID", DataFiturController.getAll);
router.post("/data", DataFiturController.post);
router.delete("/data/:dataFiturID", DataFiturController.delete);

module.exports = { router };

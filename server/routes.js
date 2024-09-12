const express = require("express");
const { FiturController } = require("./controllers");
const { HakAksesController } = require("./controllers/HakAksesController");
const { DataFiturController } = require("./controllers/DataFiturController");

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", FiturController.getAll);

// ###############################################################################
//                              LAPORAN
router.get("/data/:fiturID", DataFiturController.getAll);
router.post("/data", DataFiturController.post);

module.exports = { router };

const express = require("express");
const { FiturController } = require("./controllers");
const { HakAksesController } = require("./controllers/HakAksesController");
const { DataFiturController } = require("./controllers/DataFiturController");

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", FiturController.getAll);

// ###############################################################################
//                              DATA FITUR
router.get("/data/:fiturID", DataFiturController.getAll);
router.post("/data", DataFiturController.post);
router.delete("/data/:dataFiturID", DataFiturController.delete);

module.exports = { router };

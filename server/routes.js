const express = require("express");
const { FiturController, DataFiturController } = require("./controllers");

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", FiturController.getAllByUserID);

// ###############################################################################
//                              DATA FITUR
router.get("/data/:fiturID", DataFiturController.getAll);
router.post("/data", DataFiturController.post);
router.delete("/data/:dataFiturID", DataFiturController.delete);

module.exports = { router };

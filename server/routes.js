const express = require("express");
const { FiturController } = require("./controllers");

const router = express.Router();

// ###############################################################################
//                              FITUR
router.get("/fitur", FiturController.getAll);

// ###############################################################################
//                              AAAA

module.exports = router;

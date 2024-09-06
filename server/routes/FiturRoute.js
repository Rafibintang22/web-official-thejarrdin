const express = require("express");
// const { Authorization } = require("../middleware/Authorization");
const { FiturController } = require("../controllers/FiturController");

const router = express.Router();

// router.get("/", Authorization.decryption(), FiturController.getAll); KALU ADA AUTH
router.get("/", FiturController.getAll);

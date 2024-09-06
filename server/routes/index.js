const express = require("express");
const router = express.Router();

const fiturRoute = require("./FiturRoute");

// const { AuthenticationController } = require("../controllers/AuthenticationController");
// const { Authorization } = require("../middleware/Authorization");

router.get("/", (req, res) => {
  res.status(200).json("Selamat datang di server The Jarrdin");
});

router.use("/fitur", fiturRoute);

module.exports = { router };

const express = require("express");
const dotenv = require("dotenv");
const { DatabaseManager } = require("./config/DatabaseManager");

const app = express();
dotenv.config({ path: "./config/.env" });

new DatabaseManager(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  process.env.DB_HOSTNAME,
  process.env.DB_PORT,
  process.env.DB_DIALECT
);
DatabaseManager.authenticate(process.env.DB_NAME);

// const { router } = require("./routes");
// app.use("/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`>> Server is running on http://localhost:${port}`);
});

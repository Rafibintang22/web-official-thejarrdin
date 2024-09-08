const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const { router } = require("./routes");
const { DatabaseManager } = require("./config/DatabaseManager");

const app = express();

const dbManager = new DatabaseManager(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  process.env.DB_HOSTNAME,
  process.env.DB_PORT,
  process.env.DB_DIALECT
);

dbManager.authenticate(process.env.DB_NAME); // Call authenticate on the instance

app.use("/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`>> Server is running on http://localhost:${port}`);
});

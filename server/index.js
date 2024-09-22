const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
// UPLOAD FILE KE GDRIVE
const stream = require("stream");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const upload = multer();
// END UPLOAD FILE KE GDRIVE

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

DatabaseManager.authenticate(process.env.DB_NAME); // Call authenticate on the instance

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json()); //untuk server dapat menerima req body/params/query dari client menjadi format json
app.use(express.urlencoded({ extended: true })); //agar server bisa membaca req dsri client
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "authorization"],
    exposedHeaders: ["authorization"],
  })
);

// DatabaseManager.synchronize(process.env.DB_NAME, false);

const { router } = require("./routes");
app.use("/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`>> Server is running on http://localhost:${port}`);
});

const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ["1OocQkL2Yd-w_l_YEfnG1C5lx6HpNOY"],
    },
    fields: "id,name",
  });
  console.log(`Uploaded file ${data.name} ${data.id}`);
};

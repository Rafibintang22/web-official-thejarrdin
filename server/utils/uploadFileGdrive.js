const { google } = require("googleapis");
const stream = require("stream");
const path = require("path");

const KEYFILEPATH = path.join(__dirname, "../cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const DEFAULT_PARENTSID = "1gyraMNa5P7Lp_dhKpW5e7vmNR3_JT_nE";
// Create a folder on Google Drive
// DEFAULT Parent folder ID adalah rootnya dari yg di gdrive
async function createFolder(name, parentFolderId) {
  const drive = google.drive({ version: "v3", auth });
  const folderMetadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentFolderId ? parentFolderId : DEFAULT_PARENTSID], // Specify the parent folder ID
  };

  const { data } = await drive.files.create({
    resource: folderMetadata,
    fields: "id",
  });
  return data.id; // Return the ID of the created folder
}

// Set permissions for a file
async function setFilePermissions(fileId, emailUser) {
  const drive = google.drive({ version: "v3", auth });
  const permissions = emailUser.map((email) => ({
    type: "user",
    role: "reader",
    emailAddress: email,
  }));

  for (const permission of permissions) {
    await drive.permissions.create({
      resource: permission,
      fileId: fileId,
      fields: "id",
      sendNotificationEmail: false, //agar tidak terkena limit (karena hanya boleh 50 req dalam 24H)
    });
  }
}

async function uploadFileGdrive(fileObject, emailUser, folderId) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  try {
    // Upload file to the created folder
    const drive = google.drive({ version: "v3", auth });
    const { data } = await drive.files.create({
      media: {
        mimeType: fileObject.mimetype,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: [folderId ? folderId : DEFAULT_PARENTSID],
      },
      fields: "id,name",
    });

    // Set permissions for the uploaded file
    await setFilePermissions(data.id, emailUser);

    // console.log(`Uploaded file ${data.name} with ID ${data.id} to folder ${namaFolder}`);
    return data; // Return uploaded data
  } catch (error) {
    console.error(`Error uploading file ${fileObject.originalname}: ${error.message}`);
    throw error; // Propagate error
  }
}

module.exports = { uploadFileGdrive, createFolder };

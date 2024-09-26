const { MessageRepository } = require("../database/repositories");
const { uploadFileGdrive, createFolder } = require("../utils/uploadFileGdrive");
const { Validator } = require("../utils/validator");

class MessageController {
  static async post(req, res) {
    const { body, files } = req;

    // console.log(req);

    try {
      const createMessage = await MessageRepository.create(body);
      return res.status(201).json({ success: true, data: createMessage });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateRead(req, res) {
    const { MessageID } = req.body;
    const UserID = req.dataSession.UserID;

    try {
      const updateMessage = await MessageRepository.updateRead(MessageID, UserID);
      return res.status(201).json({ success: true, data: updateMessage });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = { MessageController };

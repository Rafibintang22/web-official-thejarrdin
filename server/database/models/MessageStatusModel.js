const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { MessageModel } = require("./MessageModel"); // Assuming MessageModel is defined elsewhere

const MessageStatusModel = jarrdinDB.define(
  "MessageStatus",
  {
    messageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: MessageModel, // Foreign key to MessageModel
        key: "messageID",
      },
      onDelete: "CASCADE", // If message is deleted, delete status as well
      onUpdate: "CASCADE",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // By default, the message is unread
    },
    tglDibaca: {
      type: DataTypes.DATE,
      allowNull: true, // Null means the message hasn't been read
    },
  },
  {
    tableName: "MessageStatus",
    timestamps: false, // Since we manually track 'tglDibaca', we don't need Sequelize timestamps
  }
);

// Setting up associations between Message and MessageStatus
function associationMessageStatus() {
  MessageStatusModel.belongsTo(MessageModel, {
    foreignKey: "messageID",
    targetKey: "messageID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  MessageModel.hasOne(MessageStatusModel, {
    foreignKey: "messageID",
    sourceKey: "messageID",
  });
}

associationMessageStatus();

module.exports = { MessageStatusModel };

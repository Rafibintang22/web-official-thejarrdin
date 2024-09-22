const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const { MessageModel } = require("./MessageModel");
const { UserModel } = require("./UserModel");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

const MessageTujuanModel = jarrdinDB.define(
  "message_tujuan",
  {
    messageID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    penerimaID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "message_tujuan",
    timestamps: false,
  }
);

function associationMessageTujuan() {
  // Association between MessageTujuan and Message
  MessageTujuanModel.belongsTo(MessageModel, {
    foreignKey: "messageID",
    targetKey: "messageID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  MessageModel.hasMany(MessageTujuanModel, {
    foreignKey: "messageID",
    sourceKey: "messageID",
  });
}

// Association between MessageTujuan and User
MessageTujuanModel.belongsTo(UserModel, {
  foreignKey: "penerimaID",
  targetKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

UserModel.hasMany(MessageTujuanModel, {
  foreignKey: "penerimaID",
  sourceKey: "userID",
});

associationMessageTujuan();

module.exports = { MessageTujuanModel };

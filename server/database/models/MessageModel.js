const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { UserModel } = require("./UserModel");
const { FiturModel } = require("./FiturModel");

const MessageModel = jarrdinDB.define(
  "Message",
  {
    messageID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fiturID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    pengirimID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageFile: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tglDibuat: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Message",
    timestamps: false,
  }
);

function associationMessage() {
  // Association antara DataFitur dan Fitur
  MessageModel.belongsTo(FiturModel, {
    foreignKey: "fiturID",
    targetKey: "fiturID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  FiturModel.hasMany(MessageModel, {
    foreignKey: "fiturID",
    sourceKey: "fiturID",
  });

  // Association antara Message dan User
  MessageModel.belongsTo(UserModel, {
    foreignKey: "pengirimID",
    targetKey: "userID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  UserModel.hasMany(MessageModel, {
    foreignKey: "pengirimID",
    sourceKey: "userID",
  });
}

associationMessage();

module.exports = { MessageModel };

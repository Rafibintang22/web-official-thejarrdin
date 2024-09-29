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
    parentMessageID: {
      type: DataTypes.INTEGER(11),
      allowNull: true, // Nullable: null for original messages, set for replies
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
  // Association antara message dan message untuk bisa replies
  MessageModel.belongsTo(MessageModel, {
    as: "parentMessage",
    foreignKey: "parentMessageID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  MessageModel.hasMany(MessageModel, {
    as: "replies",
    foreignKey: "parentMessageID",
  });

  // Association antara Message dan Fitur
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

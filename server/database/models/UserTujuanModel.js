const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { DataFiturModel } = require("./DataFiturModel");
const { UserModel } = require("./UserModel");

const UserTujuanModel = jarrdinDB.define(
  "user_tujuan",
  {
    dataFiturID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // By default, the message is unread
    },
  },
  {
    tableName: "user_tujuan",
    timestamps: false,
  }
);

function associationUserTujuan() {
  // Association between UserTujuan and DataFitur
  UserTujuanModel.belongsTo(DataFiturModel, {
    foreignKey: "dataFiturID",
    targetKey: "dataFiturID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  DataFiturModel.hasMany(UserTujuanModel, {
    foreignKey: "dataFiturID",
    sourceKey: "dataFiturID",
  });
}

// Association between UserTujuan and User
UserTujuanModel.belongsTo(UserModel, {
  foreignKey: "userID",
  targetKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

UserModel.hasMany(UserTujuanModel, {
  foreignKey: "userID",
  sourceKey: "userID",
});

associationUserTujuan();

module.exports = { UserTujuanModel };

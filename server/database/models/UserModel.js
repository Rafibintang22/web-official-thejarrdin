const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

const UserModel = jarrdinDB.define(
  "User",
  {
    userID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    noTelp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "User",
  }
);

module.exports = { UserModel };

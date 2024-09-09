const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

if (!jarrdinDB) {
  throw new Error("Failed to retrieve Sequelize instance from DatabaseManager");
}

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
    timestamps: false,
  }
);

module.exports = { UserModel };

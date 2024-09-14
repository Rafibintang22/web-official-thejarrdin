const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

const LoginSessionModel = jarrdinDB.define(
  "Login_session",
  {
    loginSessionID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
    noTelp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },
    activeTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "Login_session",
    timestamps: false,
  }
);

module.exports = { LoginSessionModel };

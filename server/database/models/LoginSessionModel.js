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
    },
    noTelp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Login_session",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["otp", "noTelp", "email"],
        name: "Kombinasi unik otp_noTelp_email",
      },
    ],
  }
);

module.exports = { LoginSessionModel };

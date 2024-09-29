const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { FiturModel } = require("./FiturModel");
const { UserModel } = require("./UserModel");

const DataFiturModel = jarrdinDB.define(
  "DataFitur",
  {
    dataFiturID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fiturID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tglDibuat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    userID_dibuat: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    fileFolder: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "DataFitur",
    timestamps: false,
  }
);

function associationDataFitur() {
  // Association antara DataFitur dan Fitur
  DataFiturModel.belongsTo(FiturModel, {
    foreignKey: "fiturID",
    targetKey: "fiturID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  FiturModel.hasMany(DataFiturModel, {
    foreignKey: "fiturID",
    sourceKey: "fiturID",
  });

  // Association antara DataFitur dan User
  DataFiturModel.belongsTo(UserModel, {
    foreignKey: "userID_dibuat",
    targetKey: "userID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  UserModel.hasMany(DataFiturModel, {
    foreignKey: "userID_dibuat",
    sourceKey: "userID",
  });
}

associationDataFitur();

module.exports = { DataFiturModel };

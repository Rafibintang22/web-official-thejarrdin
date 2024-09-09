const { DataTypes } = require("sequelize");
const jarrdinDB = require("../../config/DatabaseManager").getDatabase(process.env.DB_NAME);
const { DataFiturModel } = require("./DataFiturModel");

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

associationUserTujuan();

module.exports = { UserTujuanModel };

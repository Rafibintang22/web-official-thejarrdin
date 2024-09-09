const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { FiturModel } = require("./FiturModel");
const { RoleModel } = require("./RoleModel");

const HakAksesModel = jarrdinDB.define(
  "hak_akses",
  {
    fiturID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    roleID: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "hak_akses",
    timestamps: false,
  }
);

function associationHakAkses() {
  // Association antara HakAkses dan Fitur
  HakAksesModel.belongsTo(FiturModel, {
    foreignKey: "fiturID",
    targetKey: "fiturID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  FiturModel.hasMany(HakAksesModel, {
    foreignKey: "fiturID",
    sourceKey: "fiturID",
  });

  // Association antara HakAkses dan Role
  HakAksesModel.belongsTo(RoleModel, {
    foreignKey: "roleID",
    targetKey: "roleID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  RoleModel.hasMany(HakAksesModel, {
    foreignKey: "roleID",
    sourceKey: "roleID",
  });
}

associationHakAkses();

module.exports = { HakAksesModel };

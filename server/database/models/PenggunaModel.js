const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

if (!jarrdinDB) {
  throw new Error("Failed to retrieve Sequelize instance from DatabaseManager");
}

const PenggunaModel = jarrdinDB.define(
  "Pengguna",
  {
    pengguna_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    kode_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    no_unit: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "Pengguna",
    timestamps: false,
  }
);

module.exports = { PenggunaModel };

// const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
// const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

// const DataFiturModel = jarrdinDB.define(
//   "DataFitur",
//   {
//     dataFiturID: {
//       type: DataTypes.INTEGER(11),
//       primaryKey: true,
//       allowNull: false,
//       autoIncrement: true,
//     },
//     fiturID: {
//       type: DataTypes.INTEGER(11),
//       allowNull: false,
//     },
//     judul: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     tglDibuat: {
//       type: DataTypes.DATE(),
//       allowNull: false,
//     },
//     userID_dibuat: {
//       type: DataTypes.INTEGER(11),
//       allowNull: false,
//     },
//     fileFolder: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "DataFitur",
//   }
// );

// function associationDataFitur() {
//   // ######################################################################
//   SparkUserModel.belongsTo(EnterpriseModel, {
//     foreignKey: "EnterpriseID",
//     targetKey: "EnterpriseID",
//     onDelete: "RESTRICT",
//     onUpdate: "CASCADE",
//   });
//   EnterpriseModel.hasMany(SparkUserModel, {
//     foreignKey: "EnterpriseID",
//     sourceKey: "EnterpriseID",
//   });
// }

// associationSparkUser();

// module.exports = { DataFiturModel };

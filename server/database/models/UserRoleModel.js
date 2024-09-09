const { DatabaseManager, DataTypes } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);
const { UserModel } = require("./UserModel");
const { RoleModel } = require("./RoleModel");

const UserRoleModel = jarrdinDB.define(
  "user_role",
  {
    userID: {
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
    tableName: "user_role",
    timestamps: false,
  }
);

function associationUserRole() {
  // Association between UserRole and User
  UserRoleModel.belongsTo(UserModel, {
    foreignKey: "userID",
    targetKey: "userID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  UserModel.hasMany(UserRoleModel, {
    foreignKey: "userID",
    sourceKey: "userID",
  });

  // Association between UserRole and Role
  UserRoleModel.belongsTo(RoleModel, {
    foreignKey: "roleID",
    targetKey: "roleID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  RoleModel.hasMany(UserRoleModel, {
    foreignKey: "roleID",
    sourceKey: "roleID",
  });
}

associationUserRole();

module.exports = { UserRoleModel };

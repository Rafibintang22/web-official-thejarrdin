const { DataFiturController } = require("./DataFiturController");
const { FiturController } = require("./FiturController");
const { MessageController } = require("./MessageController");
const { RoleController } = require("./RoleController");
const { UserController } = require("./UserController");
const { UserRoleController } = require("./UserRoleController");

module.exports = {
  FiturController,
  DataFiturController,
  UserRoleController,
  UserController,
  RoleController,
  MessageController,
};

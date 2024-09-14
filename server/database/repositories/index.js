const { DataFiturRepository } = require("./DataFiturRepository");
const { FiturRepository } = require("./FiturRepository");
const { RoleRepository } = require("./RoleRepository");
const { UserRepository } = require("./UserRepository");
const { UserRoleRepository } = require("./UserRoleRepository");

module.exports = {
  FiturRepository,
  DataFiturRepository,
  UserRoleRepository,
  UserRepository,
  RoleRepository,
};

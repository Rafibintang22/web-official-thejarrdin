const { DataFiturSchema } = require("./DataFiturSchema");
const { UserSchema } = require("./UserSchema");

const Validator = {
  Description: "Input Validator",
};

Object.assign(Validator, DataFiturSchema, UserSchema);

module.exports = { Validator };

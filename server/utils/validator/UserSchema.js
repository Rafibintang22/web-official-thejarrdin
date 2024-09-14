const Joi = require("joi");

const UserSchema = {
  loginUser(user) {
    const schema = Joi.object({
      Email: Joi.string().email().max(200),
      noTelp: Joi.string().min(10).max(15),
    })
      .xor("Email", "noTelp") // Require untuk Email atau noTelp tapi tidak keduanya
      .required();

    return schema.validate(user);
  },
};

module.exports = { UserSchema };

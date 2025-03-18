const Joi = require("joi");

const UserSchema = {
    loginUser(user) {
        const schema = Joi.object({
            Email: Joi.string().email().max(200),
            NoTelp: Joi.string().min(10).max(20),
        })
            .xor("Email", "NoTelp") // Require untuk Email atau noTelp tapi tidak keduanya
            .required();

        return schema.validate(user);
    },

    updateUser(user) {
        const schema = Joi.object({
            UserID: Joi.number().max(11).required(),
            Nama: Joi.string().max(255).required(),
            Email: Joi.string().email().max(200).allow(null).allow(""),
            NoTelp: Joi.string().min(10).max(20).allow(null).allow(""),
            Alamat: Joi.string().max(255).required(),
            NoUnit: Joi.string().max(255).required(),
            Role: Joi.array()
                .items(
                    Joi.object({
                        Action: Joi.string().optional(),
                        RoleID: Joi.number().required(),
                    })
                )
                .min(1)
                .required(),
        }).or("Email", "NoTelp"); // Salah satu atau keduanya harus terisi;

        return schema.validate(user);
    },
};

module.exports = { UserSchema };

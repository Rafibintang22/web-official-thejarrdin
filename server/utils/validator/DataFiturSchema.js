const Joi = require("joi");

const DataFiturSchema = {
  createDataFitur(dataFitur) {
    // Skema untuk validasi satu objek DataFitur
    const schema = Joi.object({
      FiturID: Joi.number().integer().min(1).required(),
      Judul: Joi.string().min(3).max(255).required(),
      TglDibuat: Joi.number().integer().min(0).required(),
      UserID_dibuat: Joi.number().integer().min(1).required(),
      FileFolder: Joi.string().min(1).max(255).required(),
      UserTujuan: Joi.array().items(Joi.number().integer().min(1)).min(1).required(), // Array berisi userID tujuan, minimal ada 1
    });

    // Validasi dataFitur berdasarkan schema
    return schema.validate(dataFitur, { abortEarly: false });
  },
};

module.exports = { DataFiturSchema };

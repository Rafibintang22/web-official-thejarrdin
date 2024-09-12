const Joi = require("joi");

const DataFiturSchema = {
  createDataFitur(dataFitur) {
    // Skema untuk validasi satu objek DataFitur
    const schema = Joi.object({
      fiturID: Joi.number().integer().min(1).required(),
      judul: Joi.string().min(3).max(255).required(),
      tglDibuat: Joi.date().iso().required(),
      userID_dibuat: Joi.number().integer().min(1).required(),
      fileFolder: Joi.string().min(1).max(255).required(),
      userTujuan: Joi.array().items(Joi.number().integer().min(1)).min(1).required(), // Array berisi userID tujuan, minimal ada 1
    });

    // Validasi dataFitur berdasarkan schema
    return schema.validate(dataFitur, { abortEarly: false });
  },
};

module.exports = { DataFiturSchema };

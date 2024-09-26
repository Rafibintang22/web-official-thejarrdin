import Joi from "joi";

const LoginSchema = Joi.object({
  User: Joi.object({
    Email: Joi.string()
      .email({ tlds: { allow: false } })
      .max(200)
      .messages({
        "string.email": "Format email tidak valid",
        "string.max": "Email tidak boleh lebih dari 200 karakter",
      }),

    NoTelp: Joi.string().min(10).max(20).messages({
      "string.min": "Nomor telepon minimal harus 10 karakter",
      "string.max": "Nomor telepon tidak boleh lebih dari 20 karakter",
    }),
  })
    .xor("Email", "NoTelp") // Hanya menerima salah satu, Email atau noTelp
    .required()
    .messages({
      "object.xor": "Hanya boleh mengisi salah satu: email atau no telepon", // Tambahkan pesan error untuk xor
    }),
});

const VerifyOtp = Joi.object({
  Email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(200)
    .messages({
      "string.email": "Format email tidak valid",
      "string.max": "Email tidak boleh lebih dari 200 karakter",
    }),
  NoTelp: Joi.string().min(10).max(20).messages({
    "string.min": "Nomor telepon minimal harus 10 karakter",
    "string.max": "Nomor telepon tidak boleh lebih dari 20 karakter",
  }),
  Otp: Joi.string().min(6).max(6).required().messages({
    "string.min": "Nomor otp minimal harus 6 karakter",
    "string.max": "Nomor otp tidak boleh lebih dari 6 karakter",
  }),
});

const DataFitur = Joi.object({
  FiturID: Joi.number().integer().min(1).required().messages({
    "number.base": "ID fitur harus berupa angka",
    "number.min": "ID fitur minimal 1",
    "any.required": "ID fitur wajib diisi",
  }),
  Judul: Joi.string().min(3).max(255).required().messages({
    "string.min": "Judul minimal harus 3 karakter",
    "string.max": "Judul tidak boleh lebih dari 255 karakter",
    "any.required": "Judul wajib diisi",
  }),
  TglDibuat: Joi.number().integer().min(0).required().messages({
    "number.base": "Tanggal harus berupa epoch time dalam milidetik",
    "number.min": "Tanggal tidak boleh negatif",
  }),
  UserID_dibuat: Joi.number().integer().min(1).required().messages({
    "number.base": "UserID dibuat harus berupa angka",
    "number.min": "UserID dibuat minimal 1",
    "any.required": "UserID dibuat wajib diisi",
  }),
  FileFolder: Joi.alternatives()
    .try(
      Joi.array().min(1).messages({
        "array.base": "FileFolder harus berupa array",
        "array.min": "Minimal harus ada 1 file",
      }),
      Joi.string() // Allow FileFolder to be a string
    )
    .required()
    .messages({
      "any.required": "File wajib diisi",
    }),
  UserTujuan: Joi.array().items(Joi.number().integer().min(1)).min(1).required().messages({
    "array.min": "Minimal harus ada 1 user tujuan",
    "any.required": "User tujuan wajib diisi",
  }),
});

const DataAspirasi = Joi.object({
  Judul: Joi.string().min(3).max(255).required().messages({
    "string.min": "Judul minimal harus 3 karakter",
    "string.max": "Judul tidak boleh lebih dari 255 karakter",
    "any.required": "Judul wajib diisi",
  }),
});

const validateData = (data, schema) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    throw errorDetails[0];
  }
  return { message: "" };
};

export const inputValidator = {
  Login: (formData) => validateData(formData, LoginSchema),
  VerifyOtp: (formData) => validateData(formData, VerifyOtp),
  DataFitur: (formData) => validateData(formData, DataFitur),
  DataAspirasi: (formData) => validateData(formData, DataAspirasi),
};

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
};

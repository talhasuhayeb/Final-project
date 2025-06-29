const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .when("role", {
        is: Joi.string().valid("admin"),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),

    phone: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .when("role", {
        is: Joi.string().valid("admin"),
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.pattern.base": "Phone number must be exactly 11 digits.",
      }),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};
module.exports = {
  signupValidation,
  loginValidation,
};

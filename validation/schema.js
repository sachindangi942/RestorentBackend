const Joi = require("joi");

exports.createUserSchema = Joi.object({
    Name: Joi.string().required().min(2),
    Email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

exports.registrationSchema = Joi.object({
    Name: Joi.string().required().min(2).max(15),
    Email: Joi.string().email().required(),
    Mobile: Joi.string().required().pattern(/^\+?[6-9][0-9]{9}$/).message({
        'string.pattern.base': 'Mobile number must be a valid 10-digit number',
        'any.required': 'Mobile number is required'
    }),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
        })
});

exports.loginSchema = Joi.object({
    Email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.forgotPasswordSchema = Joi.object({
    Email: Joi.string().email().required()
});
exports.restetPasswordSchema = Joi.object({
    password: Joi.string().required().min(6)
});

exports.addProductSchema = Joi.object({
    code: Joi.string().required().min(1),
    iteam: Joi.string().required().min(2),
    price: Joi.number().required().min(5),
    quantity: Joi.number()
});

exports.delateUserSchema = Joi.object({
    user_id: Joi.string().required()
});
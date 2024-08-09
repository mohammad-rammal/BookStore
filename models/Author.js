const Joi = require("joi");
const mongoose = require("mongoose")

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    nationality: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    image: {
        type: String,
        default: "avatar.png"
    },
}, {
    timestamps: true
});

const Author = mongoose.model("Author", AuthorSchema)

function validateCreateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(3).max(100).required(),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(200),
        nationality: Joi.string().trim().min(3).max(100),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
}
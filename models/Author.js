const { required } = require("joi")
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

module.exports = {
    Author
}
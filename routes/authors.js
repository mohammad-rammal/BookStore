const express = require("express");
const Joi = require("joi");
const { Author } = require("../models/Author");

const router = express.Router();

const authors = [
    {
        id: 1,
        firstName: "Mhmd",
        lastName: "Adam",
        nationality: "Lebanon",
        image: "image.png",
    },
]



/**
 *  @desc    Get all authors
 *  @route   /api/authors
 *  @method  Get
 *  @access  public
 */
router.get("/", async (req, res) => {

    const authorList = await Author.find()

    res.status(200).json(authorList);
});

/**
 *  @desc    Get author by id
 *  @route   /api/authors/:id
 *  @method  Get
 *  @access  public
 */
router.get("/:id", (req, res) => {
    // anything from url is string ---
    const author = authors.find((b) => b.id === parseInt(req.params.id)); // must convert string to number
    if (author) {
        res.status(200).json(author);
    } else {
        res.status(400).json({ message: "Author not found" });
    }
});

/**
 *  @desc    Create new author
 *  @route   /api/authors
 *  @method  Post
 *  @access  public
 */
router.post("/", async (req, res) => {
    //console.log(req.body) // req from client (body) is json file not object,, so must convert json to object

    const { error } = validateCreateAuthor(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // bz promise will have success and error
    try {
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image,
        })

        const result = await author.save() // save will get promise , so must have await, so must be async
        res.status(201).json(author); // 201 created successfully

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Problem in server " })
    }

});

/**
 *  @desc    Update a author
 *  @route   /api/authors/:id
 *  @method  Put
 *  @access  public
 */
router.put("/:id", (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const author = authors.find((b) => b.id === parseInt(req.params.id));
    if (author) {
        res.status(200).json({ message: "Author has been updated" });
    } else {
        res.status(404).json({ message: "Author not found" });
    }
});

/**
 *  @desc    Delete a author
 *  @route   /api/authors/:id
 *  @method  Delete
 *  @access  public
 */
router.delete("/:id", (req, res) => {
    const author = authors.find((b) => b.id === parseInt(req.params.id));
    if (author) {
        res.status(200).json({ message: "Author has been deleted" });
    } else {
        res.status(404).json({ message: "Author not found" });
    }
});

function validateCreateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(200),
        nationality: Joi.string().trim().min(3).max(200),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

module.exports = router
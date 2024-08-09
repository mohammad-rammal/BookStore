const express = require("express");
const Joi = require("joi");

const router = express.Router();

const books = [
    //object array
    {
        id: 1,
        title: "book1",
        author: "Nasim",
        description: "About Black",
        price: 10,
        cover: "soft cover",
    },
    {
        id: 2,
        title: "book2",
        author: "Ahmad",
        description: "About White",
        price: 3,
        cover: "Hard cover",
    },
];

/**
 *  @desc    Get all books
 *  @route   /api/books
 *  @method  Get
 *  @access  public
 */
router.get("/", (req, res) => {
    res.status(200).json(books);
});

/**
 *  @desc    Get book by id
 *  @route   /api/books/:id
 *  @method  Get
 *  @access  public
 */
router.get("/:id", (req, res) => {
    // anything from url is string ---
    const book = books.find((b) => b.id === parseInt(req.params.id)); // must convert string to number
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ message: "Book not found" });
    }
});

/**
 *  @desc    Create new book
 *  @route   /api/books
 *  @method  Post
 *  @access  public
 */
router.post("/", (req, res) => {
    //console.log(req.body) // req from client (body) is json file not object,, so must convert json to object

    const { error } = validateCreateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
    };

    books.push(book);
    res.status(201).json(book); // 201 created successfully
});

/**
 *  @desc    Update a book
 *  @route   /api/books/:id
 *  @method  Put
 *  @access  public
 */
router.put("/:id", (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (book) {
        res.status(200).json({ message: "Book has been updated" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

/**
 *  @desc    Delete a book
 *  @route   /api/books/:id
 *  @method  Delete
 *  @access  public
 */
router.delete("/:id", (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (book) {
        res.status(200).json({ message: "Book has been deleted" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200).required(),
        author: Joi.string().trim().min(3).max(200).required(),
        description: Joi.string().trim().min(3).max(500).required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().trim().required(),
    });

    return schema.validate(obj);
}

function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200),
        author: Joi.string().trim().min(3).max(200),
        description: Joi.string().trim().min(3).max(500),
        price: Joi.number().min(0),
        cover: Joi.string().trim(),
    });

    return schema.validate(obj);
}

module.exports = router;

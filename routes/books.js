const express = require("express");
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const { validateCreateBook, validateUpdateBook, Book } = require("../models/Book");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();


/**
 *  @desc    Get all books
 *  @route   /api/books
 *  @method  Get
 *  @access  public
 */
router.get("/", asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]);
    res.status(200).json(books);
}));

/**
 *  @desc    Get book by id
 *  @route   /api/books/:id
 *  @method  Get
 *  @access  public
 */
router.get("/:id", asyncHandler(async (req, res) => {
    // anything from url is string ---
    const book = await Book.findById(req.params.id).populate("author"); // must convert string to number parseInt
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ message: "Book not found" });
    }
}));

/**
 *  @desc    Create new book
 *  @route   /api/books
 *  @method  Post
 *  @access  private (Only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    //console.log(req.body) // req from client (body) is json file not object,, so must convert json to object

    const { error } = validateCreateBook(req.body);// result

    if (error) { // result.error
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
    });

    const result = await book.save();
    res.status(201).json(result); // 201 created successfully
}));

/**
 *  @desc    Update a book
 *  @route   /api/books/:id
 *  @method  Put
 *  @access  private (Only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover,
        }
    }, { new: true })

    res.status(200).json(updatedBook)

}));

/**
 *  @desc    Delete a book
 *  @route   /api/books/:id
 *  @method  Delete
 *  @access  private (Only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        await Book.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Book has been deleted" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
}));


module.exports = router;

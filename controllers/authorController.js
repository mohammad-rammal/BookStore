const {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor,
} = require("../models/Author");
const asyncHandler = require("express-async-handler");


/**
 *  @desc    Get all authors
 *  @route   /api/authors
 *  @method  Get
 *  @access  public
 */

const getAllAuthors = asyncHandler(async (req, res) => {
    // const authorList = await Author.find(); //.sort({ firstName: 1 }).select("firstName lastName -_id")//-1 inverse

    const { pageNumber } = req.query;
    const authorsPerPage = 2;
    let authorList;
    if (pageNumber) {
        authorList = await Author.find().skip((pageNumber - 1) * authorsPerPage).limit(authorsPerPage);
    } else {
        authorList = await Author.find();
    }

    res.status(200).json(authorList);
})

/**
 *  @desc    Get author by id
 *  @route   /api/authors/:id
 *  @method  Get
 *  @access  public
 */
const getAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);

    if (author) {
        res.status(200).json(author);
    } else {
        res.status(400).json({ message: "Author not found" });
    }
})


/**
 *  @desc    Create new author
 *  @route   /api/authors
 *  @method  Post
 *  @access  private (Only admin)
 */
const createNewAuthor = asyncHandler(async (req, res) => {
    //console.log(req.body) // req from client (body) is json file not object,, so must convert json to object
    const { error } = validateCreateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // bz promise will have success and error
    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
    });

    const result = await author.save(); // save will get promise , so must have await, so must be async
    res.status(201).json(author); // 201 created successfully
})

/**
 *  @desc    Update an author
 *  @route   /api/authors/:id
 *  @method  Put
 *  @access  private (Only admin)
 */
const updateAuthor = asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const author = await Author.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image: req.body.image,
            },
        },
        { new: true }
    );
    res.status(200).json(author);
})

/**
 *  @desc    Delete a author
 *  @route   /api/authors/:id
 *  @method  Delete
 *  @access  private (Only admin)
 */
const deleteAuthor = asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Author has been deleted" });
    } else {
        res.status(404).json({ message: "Author not found" });
    }
})


module.exports = {
    getAllAuthors,
    getAuthorById,
    createNewAuthor,
    updateAuthor,
    deleteAuthor
}
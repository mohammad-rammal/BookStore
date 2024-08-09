const express = require("express");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");

const router = express.Router();

/**
 *  @desc    Get all authors
 *  @route   /api/authors
 *  @method  Get
 *  @access  public
 */
router.get("/", async (req, res) => {
    try {
        const authorList = await Author.find(); //.sort({ firstName: 1 }).select("firstName lastName -_id")//-1 inverse
        res.status(200).json(authorList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem in server (Something Wrong) " });
    }
});

/**
 *  @desc    Get author by id
 *  @route   /api/authors/:id
 *  @method  Get
 *  @access  public
 */
router.get("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (author) {
            res.status(200).json(author);
        } else {
            res.status(400).json({ message: "Author not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem in server " });
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
        });

        const result = await author.save(); // save will get promise , so must have await, so must be async
        res.status(201).json(author); // 201 created successfully
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem in server " });
    }
});

/**
 *  @desc    Update a author
 *  @route   /api/authors/:id
 *  @method  Put
 *  @access  public
 */
router.put("/:id", async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem in server " });
    }
});

/**
 *  @desc    Delete a author
 *  @route   /api/authors/:id
 *  @method  Delete
 *  @access  public
 */
router.delete("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            await Author.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "Author has been deleted" });
        } else {
            res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem in server " });
    }
});



module.exports = router;

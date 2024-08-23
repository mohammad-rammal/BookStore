const express = require("express");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
    getAllAuthors,
    getAuthorById,
    createNewAuthor,
    deleteAuthor,
    updateAuthor,
} = require("../controllers/authorController");

const router = express.Router();


// /api/authers
router
    .route("/")
    .get(getAllAuthors)
    .post(verifyTokenAndAdmin, createNewAuthor);


// /api/authers/:id
router
    .route("/:id")
    .get(getAuthorById)
    .put(verifyTokenAndAdmin, updateAuthor)
    .delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;

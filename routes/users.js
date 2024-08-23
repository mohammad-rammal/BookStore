const express = require("express");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser,
} = require("../controllers/userController");

const router = express.Router();


// /api/users
router.route("/").get(verifyTokenAndAdmin, getAllUsers);


// /api/users/:id
router
    .route("/:id")
    .get(verifyTokenAndAuthorization, getUserById)
    .put( verifyTokenAndAuthorization, updateUser)
    .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;

const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { validateUpdateUser, User } = require("../models/User");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private
 */
router.put("/:id", verifyToken, asyncHandler(async (req, res) => {

    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Not allowed, you can only update your profile! (Forbidden)" })
    }

    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        }
    }, { new: true }).select("-password");

    res.status(200).json(updatedUser);

}))


module.exports = router;
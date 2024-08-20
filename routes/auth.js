const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { validateRegisterUser, User } = require("../models/User");

const router = express.Router();

/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
router.post("/register", asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "The user already registered before" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        isAdmin: req.body.isAdmin,
    })

    const result = await user.save();
    const token = null;

    const { password, ...other } = result._doc;

    res.status(201).json({ ...other, token });

}));


module.exports = router;
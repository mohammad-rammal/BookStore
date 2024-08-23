const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 *  @desc    Get Forgot Password
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */
const getForgotPassword = asyncHandler((req, res) => {
    res.render('forgot-password')
})

/**
 *  @desc    Send Forgot Password
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public
 */
const sendForgotPasswordLink = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "User not found! (No Account For This Email)" })
    }

    const secretKey = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
        expiresIn: '20m'
    });

    const link = `http://localhost:${process.env.PORT}/password/reset-password/${user._id}/${token}`;

    res.json({ message: 'Click on the link', resetPasswordLink: link })

})


/**
 *  @desc    Get Reset Password Link
 *  @route   /password/reset-password/:userId/:token
 *  @method  GET
 *  @access  public
 */
const getForgotPasswordLink = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found! (No Account For This Email)" });
    }

    const secretKey = process.env.JWT_SECRET_KEY + user.password;

    try {
        jwt.verify(req.params.token, secretKey);
        res.render('reset-password', { email: user.email });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Token has expired. Please request a new password reset link." });
        }
        console.log(error);
        res.status(400).json({ message: "Failed to verify token" });
    }
});


/**
 *  @desc    Reset Password 
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public
 */
const getResetPassword = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found! (No Account For This Email)" })
    }
    if (req.body.password < 8) {
        return res.status(404).json({ message: "Password must be not less than 8 chars" })
    }

    const secretKey = process.env.JWT_SECRET_KEY + user.password;

    try {
        jwt.verify(req.params.token, secretKey);

        const salt = await bycrpt.genSalt(10);
        hashedPassword = await bycrpt.hash(req.body.password, salt);

        user.password = hashedPassword;

        await user.save();
        res.render('success-password')

    } catch (error) {
        console.log(error);
        res.json({ message: "Failed" })
    }

})


module.exports = {
    getForgotPassword,
    sendForgotPasswordLink,
    getForgotPasswordLink,
    getResetPassword
}
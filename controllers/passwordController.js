const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,// my gmail
            pass: process.env.USER_PASS,// gmail app password
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL, // your Gmail address
        to: user.email,
        subject: "Reset Your Password - Action Required",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center;">
                <img src="https://res.cloudinary.com/dftxzx2zc/image/upload/v1724451272/cv/f0etakxap6h4fmbtksgt.png" alt="Company Logo" style="max-width: 150px;">
            </div>
                <h2 style="color: #007bff; text-align: center;">Password Reset Request</h2>
                <p style="font-size: 16px;">Hi <strong>${user.username}</strong>,</p>
                <p style="font-size: 16px;">
                    We received a request to reset your password. If you didn't request this, please ignore this email. Otherwise, click the button below to reset your password:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                        Reset My Password
                    </a>
                </div>
                <p style="font-size: 16px;">For your security, this link will expire in 20 minutes.</p>
                <p style="font-size: 16px;">Thank you,</p>
                <p style="font-size: 16px; font-weight: bold;">The BookStore Team</p>
                <hr style="border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #888;">
                    If you didn’t request this email, you can safely ignore it. This email is automatically generated.
                </p>
            </div>
        </div>`
    };


    transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Something Wrong! (Failed)" })
        } else {
            console.log("Email sent: " + success.response);
            res.render("link-send");
        }
    });

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

    const { error } = validateChangePassword(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found! (No Account For This Email)" })
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
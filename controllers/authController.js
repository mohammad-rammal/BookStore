const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const {
    validateRegisterUser,
    User,
    validateLoginUser,
} = require('../models/User');

/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
const register = asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res
            .status(400)
            .json({ message: 'The user is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
    });

    const result = await user.save();
    const token = user.generateToken();

    const { password, ...other } = result._doc;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: 'Welcome to BookStore - Registration Successful',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <div style="text-align: center;">
                    <img src="https://res.cloudinary.com/dftxzx2zc/image/upload/v1724451272/cv/f0etakxap6h4fmbtksgt.png" alt="Company Logo" style="max-width: 150px;">
                </div>
                <h2 style="color: #007bff; text-align: center;">Welcome to BookStore!</h2>
                <p style="font-size: 16px;">Hi <strong>${user.username}</strong>,</p>
                <p style="font-size: 16px;">
                    Congratulations! You have successfully registered on BookStore. We’re thrilled to have you as part of our community.
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <p style="font-size: 16px;">Thank you for joining us. If you have any questions, feel free to reach out to our support team.</p>
                    <p style="font-size: 16px;">Happy Reading!</p>
                    <p style="font-size: 16px; font-weight: bold;">The BookStore Team</p>
                    <hr style="border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #888;">
                        If you did not register for this account, please contact our support team immediately. This email is automatically generated.
                    </p>
                </div>
            </div>
        </div>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(201).json({ ...other, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong! (Failed to send email)',
        });
    }
});

/**
 *  @desc    Login User
 *  @route   /api/auth/login
 *  @method  POST
 *  @access  public
 */
const login = asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
            message: 'The user not registered before or wrong password',
        });
    }

    const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: 'The user not registered before or wrong password',
        });
    }

    const token = user.generateToken();

    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, token });
});

module.exports = {
    register,
    login,
};

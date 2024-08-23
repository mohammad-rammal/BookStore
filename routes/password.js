const express = require("express");
const {
    getForgotPassword,
    sendForgotPasswordLink,
    getForgotPasswordLink,
    getResetPassword,
} = require("../controllers/passwordController");
const router = express.Router();

// /password/forgot-password
router
    .route("/forgot-password")
    .get(getForgotPassword)
    .post(sendForgotPasswordLink);

// /password/reset-password/:id/:token
router
    .route("/reset-password/:userId/:token")
    .get(getForgotPasswordLink)
    .post(getResetPassword);

module.exports = router;

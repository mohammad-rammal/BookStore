const express = require("express");
const router = express.Router();
const { upload } = require("../utils/uploadImage");
const { uploadImage } = require("../controllers/uploadController");


// /api/upload
router.post("/", upload.single("image"), uploadImage)

module.exports = router;
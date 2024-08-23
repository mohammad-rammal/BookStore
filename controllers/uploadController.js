const asyncHandler = require("express-async-handler");

/**
 *  @desc    Uplaod Image
 *  @route   /api/upload
 *  @method  POST
 *  @access  public
 */
const uploadImage = asyncHandler((req, res) => {
    res.status(200).json({ message: "Image Uploaded Successfully.." })
})

module.exports = {
    uploadImage
}
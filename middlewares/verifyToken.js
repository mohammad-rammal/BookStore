const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();

        } catch (error) {
            res.status(401).json({ message: "Wrong (Invalid Token)" })
        }

    } else {
        res.status(401).json({ message: "Unauthorized (No Token Provided)" })
    }
}

function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed! (Don't have permissions)" })
        }
    })
}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed! (Only Admin)" })
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}
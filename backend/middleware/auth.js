const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/UserModel");

exports.isAuthenticatedUser =catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler(401,"please login for access this resources!"))
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodeData.id);
    next();
})

//  admin role
exports.authorizeRoles = (...roles) => {
    return ( req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(401,`${req.user.role} can not access this resoures!`));
        };
        next();
    }
}
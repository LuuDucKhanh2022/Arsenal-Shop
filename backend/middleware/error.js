const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message =  err.message || "interval server error";

    //fix id not match with mongodb id format
    if(err.name ==="CastError" ) {
        const message =`Id  must be a string of 12 bytes or a string of 24 hex characters or an integer...Invalid ${err.path}`;
        err = new ErrorHandler(400,message);
    }

    // Duplicate key error

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(400,message);
    }

     // Wrong Jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Your url is invalid please try again`;
        err = new ErrorHandler(400,message);
    }

    //Jwt expired error
    if (err.name === "TokenExpiredError") {
        const message = `Your url is expired please try again`;
        err = new ErrorHandler(400,message);
    }
   
        
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
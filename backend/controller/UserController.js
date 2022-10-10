const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register user
exports.createUser = catchAsyncErrors(async (req, res, next)=> {
    const { name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id :"https://test.com",
            url: "https://test.com"
        }
    })

    sendToken(user,200,res);
});

//Login user
exports.loginUser = catchAsyncErrors(async (req, res ,next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return next(new ErrorHandler(400,"Please enter your email & password"))
    }
    const user =await User.findOne({email}).select("+password");

    if(!user) {
        return next(new ErrorHandler(401, "User is not found with this email and password"))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler(401,"User is not found with this email and password"));
    }

    sendToken(user,201,res);
})

//logout user

exports.logoutUser = catchAsyncErrors( async (req, res,next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Log out success",
    });
});


//  forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});
    if( !user) {
        return next(new ErrorHandler(404,`User not found ưith this ${req.body.email}`));
    }

    //Get reset password token
    const resetToken = user.getResetToken();
    await user.save({
        validateBeforeSave: false
    });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

     try {
        await sendMail({
            email: user.email,
            subject: 'Arsenal Shop password recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

     } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;

        await user.save({
            validateBeforeSave: false
        });

        return next(new ErrorHandler(null,error.message))
     }
})

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Create Token hash
  
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(400,"Reset password url is invalid or has been expired")
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler(400,"Password is not matched with the new password")
      );
    }
  
    user.password = req.body.password;
  
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
});

// Get user details

exports.getUserDetails = catchAsyncErrors( async(req,res,next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true, 
        user
    })
})

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
   
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(
        new ErrorHandler(400,"Old Password is incorrect")
      );
    };

    if(req.body.newPassword  !== req.body.confirmPassword){
        return next(
            new ErrorHandler(400,"Password not matched with each other")
          );
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});

exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id,newUserData, {
        new: true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true
    })
})

// Get all user -admin
exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// Get Single User Details -Admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.params.id);
   
    if(!user){
        return next(new ErrorHandler(400,"User is not found with this id"));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Change user Role -Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user
    })
});

// Delete User -Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next) =>{
  
    const user = await User.findById(req.params.id);
 
     if(!user){
         return next(new ErrorHandler("User is not found with this id",400));
     }
 
     await user.remove();
 
     res.status(200).json({
         success: true,
         message:"User deleted successfully"
     })
});
const User = require("../models/UserModel");
const Token = require("../models/tokenModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    // error occur
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    // if email is exist into database i.e. email is associated with another user.
    else if (user) {
      return res.status(400).send({
        msg: "This email address is already associated with another account.",
      });
    }
    // if user is not exist into database then save the user into database for register account
    else {
      // password hashing for save into databse
      req.body.password = Bcrypt.hashSync(req.body.password, 10);
      // create and save user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // generate token and save
        var token = new Token({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        token.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }

          // Send email (use credintials of SendGrid)
          var transporter = nodemailer.createTransport({
            service: "Sendgrid",
            auth: {
              user: process.env.SENDGRID_USERNAME,
              pass: process.env.SENDGRID_PASSWORD,
            },
          });
          var mailOptions = {
            from: "no-reply@example.com",
            to: user.email,
            subject: "Account Verification Link",
            text:
              "Hello " +
              req.body.name +
              ",\n\n" +
              "Please verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/confirmation/" +
              user.email +
              "/" +
              token.token +
              "\n\nThank You!\n",
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).send({
                msg: "Technical Issue!, Please click on resend for verify your Email.",
              });
            }
            return res
              .status(200)
              .send(
                "A verification email has been sent to " +
                  user.email +
                  ". It will be expire after one day. If you not get verification Email click on resend token."
              );
          });
        });
      });
    }
  });
};

// Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let userAvatar;
    if (avatar === "/profile.png") {

      userAvatar = {
        public_id: "avatars/profile_gfcff6.png",
        url: "https://res.cloudinary.com/dqavgynuv/image/upload/v1668826793/avatars/profile_gfcff6.png",
      };
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      userAvatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    // user = await User.create({
    //   name,
    //   email,
    //   password,
    //   avatar: userAvatar,
    // });
    user = new User({
      name,
      email,
      password,
      avatar: userAvatar,
    });

    user.save(function (err) {
      if (err) {
        return next(new ErrorHandler(500, err.message));
      }
      // generate token and save
      var token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      token.save(async function (err) {
        if (err) {
          return next(new ErrorHandler(500, err.message));
        }

        // Send email 

        const message =
          `Hello ${req.body.name} \n Please veryfy your account by clicking the link: \n` +
          `http://localhost:3000/confirmation/${user.email}/${token.token}`;

        // const message =
        //   `Hello ${req.body.name} \n Please veryfy your account by clicking the link: \n` +
        //   `${req.protocol}://${req.get("host")}:3000/verify/${user.email}/${token.token}`;

        const mailOptions = {
          email: user.email,
          subject: "Accout Verification Link",
          message,
        };

        await sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message:
                "Technical Issue!, Please click on resend for verify your Email.",
            });
          }
        });
      });
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// confirm email
exports.confirmEmail = catchAsyncErrors(async (req, res, next) => {
  const token = await Token.findOne({ token: req.params.token });
  if (!token) {
    return next(
      new ErrorHandler(
        401,
        "Your verification link may have expired. Please click on resend for verify your Email."
      )
    );
  }
  const user = await User.findOne({
    _id: token._userId,
    email: req.params.email,
  });
  if (!user) {
    return next(
      new ErrorHandler(
        401,
        "We were unable to find a user for this verification. Please SignUp!"
      )
    );
  } else if (user.isVerified) {
    return next(
      new ErrorHandler(401, "User has been already verified. Please Login")
    );
  } else if(!token) {
    
  }
   else {
    await Token.findOneAndDelete({ _userId: user._id });
    user.isVerified = true;
    user.save(function (err) {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Your account has been successfully verified",
        });
      }
    });
  }
});

// resend link confirm email
exports.resendLink = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // await Token.findOneAndDelete({ _userId: user._id });
  let token;
  if (!user) {
    return next(
      new ErrorHandler(
        400,
        "'We were unable to find a user with that email. Make sure your Email is correct!"
      )
    );
  } else if (user.isVerified) {
    return next(
      new ErrorHandler(401, "User has been already verified. Please Login")
    );
  } else {
    await Token.findOneAndDelete({ _userId: user._id });
    token = await Token.create({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
  }

  // const message =
  //   `Hello ${user.name} \n Please veryfy your account by clicking the link: \n` +
  //   `${req.protocol}://${req.get("host")}/confirmation/${user.email}/${token.token}`;
  const message =
    `Hello ${user.name} \n Please veryfy your account by clicking the link: \n` +
    `http://localhost:3000/confirmation/${user.email}/${token.token}`;
  const mailOptions = {
    email: user.email,
    subject: "Accout Verification Link",
    message,
  };
  await sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message:
          "Technical Issue!, Please click on resend for verify your Email.",
      });
    }
  });

  res.status(200).json({
    success: true,
    message: "Please check your email for vefification link",
  });
});

//Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler(400, "Please enter your email & password"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler(401, "User is not found with this email and password")
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(401, "User is not found with this email and password")
    );
  }

  if (!user.isVerified) {
    return next(new ErrorHandler(400, "Your Email has not been verified"));
  }

  sendToken(user, 201, res);
});

//logout user

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

//  forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorHandler(404, `User not found with this ${req.body.email}`)
    );
  }

  //Get reset password token
  const resetToken = user.getResetToken();
  await user.save({
    validateBeforeSave: false,
  });

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
   
  const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

  const message = `Visit the link below to reset your password:- \n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Arsenal Shop password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(null, error.message));
  }
});

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
      new ErrorHandler(400, "Reset password url is invalid or has been expired")
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(400, "Password is not matched with the new password")
    );
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get user details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler(400, "Old Password is incorrect"));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "Password not matched with each other"));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  
  let newUserData = {
    name: req.body.name ? req.body.name : req.user.name,
    email: req.body.email ? req.body.email : req.user.email,
    countryCode: req.body.countryCode
      ? req.body.countryCode
      : req.user.countryCode,
    stateCode: req.body.stateCode ? req.body.stateCode : req.user.stateCode,
    address: req.body.address ? req.body.address : req.user.address,
    phoneNo: req.body.phoneNo ? req.body.phoneNo : req.user.phoneNo,
  };

  if (
    req.body.avatar !== "" &&
    req.body.avatar !== undefined &&
    req.body.avatar !==
      "https://res.cloudinary.com/dqavgynuv/image/upload/v1668826793/avatars/v43quf40uvkje8ha1usb.png"
  ) {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
    });
    newUserData = {
      ...newUserData,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    // newUserData.avatar = {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all user -admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Details -Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(400, "User is not found with this id"));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Change user Role -Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User -Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  if (!user) {
    return next(new ErrorHandler("User is not found with this id", 400));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

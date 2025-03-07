const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
   });

   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
   });

   newUser.password = undefined;

   res.status(201).json({
      status: "success",
      token,
      data: {
         newUser,
      },
   });
});

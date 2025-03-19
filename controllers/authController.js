const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const bcrypt = require("bcryptjs");
const User = require("./../models/userModel");

const signToken = (userId) => {
   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn:
         process.env.NODE_ENV === "development"
            ? process.env.JWT_EXPIRESIN_DEV
            : process.env.JWT_EXPIRESIN_PROD,
   });
};

const createSendToken = (user, statusCode, res) => {
   const token = signToken(user._id);

   user.password = undefined;

   res.setHeader("Authorization", `Bearer ${token}`);

   res.status(statusCode).json({
      status: "success",
      token: process.env.NODE_ENV === "development" ? token : undefined,
      data: {
         user,
      },
   });
};

exports.protect = catchAsync(async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      token = req.headers.authorization.split(" ")[1];
   }
   if (!token) {
      return next(
         new AppError(
            401,
            "You are no longer logged in. Please log in to access this resource.\n"
         )
      );
   }

   try {
      var decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   } catch (err) {
      return next(
         new AppError(401, "Invalid or expired token. Please log in again.\n")
      );
   }

   const user = await User.findById(decoded.id);
   if (!user) {
      return next(new AppError(401, "User no longer exists or is invalid.\n"));
   }

   req.user = user;

   next();
});

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
   });

   createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
   const { username, email, password } = req.body;

   const user = await User.findOne({
      $or: [{ username }, { email }],
   }).select("+password -__v -createdAt -updatedAt");

   if (!user) {
      await bcrypt.compare(password, "$2b$10$InvalidPlaceholder....");
      return next(new AppError(401, "Invalid credentials.\n"));
   }

   const isMatchPasswords = await user.checkPassword(password, user.password);
   if (!isMatchPasswords) {
      return next(new AppError(401, "Invalid credentials.\n"));
   }

   createSendToken(user, 200, res);
});

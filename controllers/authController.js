const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

const signToken = (payload) => {
   if (process.env.NODE_ENV == "development") {
      return jwt.sign({ payload }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRESIN_DEV,
      });
   }
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

   const matchedPasswords = await user.checkPassword(password, user.password);
   if (!matchedPasswords) {
      return next(new AppError(401, "Invalid credentials.\n"));
   }

   createSendToken(user, 200, res);
});

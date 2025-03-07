const { body, validationResult, oneOf } = require("express-validator");

exports.signupValidationRules = [
   body("username")
      .exists({ checkFalsy: true })
      .withMessage("Username is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_.]+$/)
      .withMessage(
         "Username can only contain letters, numbers, underscores, or dots"
      )
      .custom((value) => {
         if (/^\d+$/.test(value)) {
            throw new Error("Username cannot be only digits");
         }
         if (/^_+$/.test(value)) {
            throw new Error("Username cannot be only underscores");
         }
         if (/^\.+$/.test(value)) {
            throw new Error("Username cannot be only dots");
         }
         return true;
      }),

   body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),

   body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be 8-32 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage(
         "Password must include uppercase, lowercase, number, and special character"
      ),

   body("passwordConfirm")
      .exists({ checkFalsy: true })
      .withMessage("Password confirmation is required")
      .custom((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error("Passwords do not match");
         }
         return true;
      }),
];

exports.loginValidationRules = [
   oneOf(
      [
         body("username")
            .exists({ checkFalsy: true })
            .withMessage("Username is required if no email is provided"),
         body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required if no username is provided")
            .isEmail()
            .withMessage("Must be a valid email address"),
      ],
      "You must provide either a valid username or a valid email"
   ),
   body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
];

exports.validateSignup = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({
         status: "fail",
         errors: errors.array(),
      });
   }
   next();
};

exports.validateLogin = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
   }
   next();
};

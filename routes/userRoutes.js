const express = require("express");
const authController = require("./../controllers/authController");
const authValidator = require("./../validators/authValidators");

const router = express.Router();

router.post(
   "/signup",
   authValidator.signupValidationRules,
   authValidator.validateSignup,
   authController.signup
);
router.post(
   "/login",
   authValidator.loginValidationRules,
   authValidator.validateLogin,
   authController.login
);

module.exports = router;

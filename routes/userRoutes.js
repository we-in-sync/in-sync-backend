const express = require("express");
const authController = require("./../controllers/authController");
const authValidator = require("./../validators/authValidators");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     description: Registers a new user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - passwordConfirm
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass@123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass@123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: "#/components/schemas/User"
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass@123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: "#/components/schemas/User"
 *       401:
 *         description: Invalid credentials
 */

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
router.post(
   "/forgotPassword",
   authValidator.forgotPasswordValidationRules,
   authValidator.validateForgotPassword,
   authController.forgotPassword
);
router.patch(
   "/resetPassword/:token",
   authValidator.resetPasswordValidationRules,
   authValidator.validateResetPassword,
   authController.resetPassword
);

module.exports = router;

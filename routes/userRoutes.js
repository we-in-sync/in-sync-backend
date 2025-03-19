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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User's hashed password (not returned in typical API responses)
 *           example: "$2b$10$..."
 *         passwordConfirm:
 *           type: string
 *           format: password
 *           description: Confirm the user's password
 *           example: "SecurePass@123"
 *         resetToken:
 *           type: string
 *           description: Token used for password resets
 *           example: "5e37d9666431284d9fa177a930f092db7..."
 *         resetTokenExpirationDate:
 *           type: string
 *           format: date-time
 *           description: Token expiration date/time
 *           example: "2023-01-01T12:10:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T12:00:00.000Z"
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

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: Request a password reset token
 *     tags: [Authentication]
 *     description: Sends an email with a password reset token (valid for 10 minutes) to the user with the given email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Token sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Token sent to email!"
 *       404:
 *         description: Email not found (or silent error message if you prefer)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "If that email address is in our system, we sent a token."
 */

/**
 * @swagger
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: Reset the user's password
 *     tags: [Authentication]
 *     description: Resets the user's password using the token provided in the URL. The token is valid for 10 minutes.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePass@123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePass@123"
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *         description: Token is invalid or has expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Token is invalid or has expired"
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

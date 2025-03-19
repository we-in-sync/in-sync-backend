const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: [true, "Please provide a username.\n"],
         unique: true,
         trim: true,
         minlength: 3,
         maxlength: 30,
         match: /^[a-zA-Z0-9_.]+$/,
         validate: {
            validator: function (v) {
               return !/^\d+$/.test(v) && !/^_+$/.test(v) && !/^\.+$/.test(v);
            },
            message:
               "Username cannot be only numbers, only underscores, or only dots.\n",
         },
      },
      email: {
         type: String,
         required: [true, "Please provide your email.\n"],
         unique: true,
         trim: true,
         lowercase: true,
         validate: [validator.isEmail, "Please provide a valid email.\n"],
      },
      password: {
         type: String,
         required: [true, "Please provide your password"],
         minlength: 8,
         maxlength: 32,
         select: false,
         match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
            "Password must be 8-32 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
         ],
      },
      passwordConfirm: {
         type: String,
         required: [true, "Please confirm your password"],
         select: false,
         validate: {
            validator: function (el) {
               return el === this.password;
            },
            message: "Passwords are not the same!",
         },
      },
      resetToken: {
         type: String,
         select: false,
      },
      resetTokenExpirationDate: {
         type: Date,
         select: false,
      },
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      return next();
   }

   this.password = await bcrypt.hash(this.password, 12);
   this.passwordConfirm = undefined;

   next();
});

userSchema.methods.checkPassword = async function (
   candidatePassword,
   userPassword
) {
   return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(3).toString("hex");

   this.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

   if (process.env.NODE_ENV === "development") {
      console.log({ resetToken }, this.resetToken);
   }

   this.resetTokenExpirationDate = Date.now() + 10 * 60 * 1000;

   return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

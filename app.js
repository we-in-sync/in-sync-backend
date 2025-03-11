const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const { swaggerUi, swaggerDocs } = require("./utils/swagger");

const app = express();

// Body Parser
app.use(express.json());

// Helmet
app.use(helmet());

// Cookie Parser
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
   // TO-DO Better!
   const limiter = rateLimit({
      max: 500,
      windowMs: 60 * 60 * 1000,
      message: "Too many requests from this ip, please try again in an hour!",
   });
   app.use("/api", limiter);
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Parameter pollution
//app.use(hpp({}))

app.use("/api/v1/users", userRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.all("*", (req, res, next) => {
   next(new AppError(404, `The endpoint ${req.originalUrl} does not exist!`));
});

app.use(globalErrorHandler);

module.exports = app;

import { errorResponse } from "../utils/response.util.js";

const errorHandler = (err, req, res, next) => {
  console.error("\nERROR ");
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Message:", err.message);

  if (process.env.NODE_ENV !== "production") {
    console.error("Stack:", err.stack);
  }

  //   Custom ApiError
  if (err.isOperational) {
    return errorResponse({
      res,
      statusCode: err.statusCode,
      message: err.message,
      details: process.env.NODE_ENV !== "production" ? err.details : null,
    });
  }

  //   Mongoose Validation Error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return errorResponse({
      res,
      statusCode: 400,
      message: "Validation failed",
      details,
    });
  }
  //   Mongoose Cast Error
  if (err.name === "CastError") {
    return errorResponse({
      res,
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  //   MongoDB Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return errorResponse({
      res,
      statusCode: 409,
      message: `${field || "Resource"} already exists`,
    });
  }

  //   JSON Body Parsing Error
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    return errorResponse({
      res,
      statusCode: 400,
      message: "Invalid JSON request body",
    });
  }

  //   Default Error
  return errorResponse({
    res,
    statusCode: err.statusCode || 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",

    details: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
};

export default errorHandler;

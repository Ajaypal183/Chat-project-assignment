export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  if (res.statusCode === 200) {
    return next(err);
  }
  res.status(res.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

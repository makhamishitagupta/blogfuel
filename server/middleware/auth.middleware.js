import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";

export const auth = catchAsync(async (req, res, next) => {
  let token;

  // 1) Get token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401));
  }

  try {
    // 2) Verify token
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // 4) Grant access
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
});

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  next();
};

// verifyToken is now imported from ../utils/jwt.js and used inside 'auth' middleware.
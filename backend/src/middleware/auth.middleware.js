import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Invalid token", 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorzed", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Permission prohibited", 403);
    }
    next()
  };
};

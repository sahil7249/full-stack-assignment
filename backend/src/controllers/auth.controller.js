import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user == null) {
    throw new AppError("User does not exists with given email", 404);
  }

  if (!bcrypt.compare(password, user.password)) {
    throw new AppError("Invalid credentials", 500);
  }

  const token = jwt.sign({
    id : user.id,
    role : user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn : '7d'
  })
  delete user.password
  
  const data = {
    user: user,
    token : token
  }

  return res.json(new ApiResponse(201, "User logged in successfully",data));
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, address, role } = req?.body;

  const isUserAlreadyExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (isUserAlreadyExists != null) {
    throw new AppError("User exists already with given email", 409);
  }

  const hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALT_ROUNDS),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address,
      role,
    },
    omit: { password: true },
  });
  res.status(200).json(new ApiResponse(200, "User created successfully", user));
});
import prisma from "../config/prisma.config.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const registerUser = asyncHandler(async (req, res) => {
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
  res.status(201).json(new ApiResponse(201, "User created successfully", user));
});

export const loginUser = asyncHandler(async (req, res) => {
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

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ omit: { password: true } });
  return res.json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError(`User not found with id : ${id}`, 404);
  }

  return res.json(new ApiResponse(200, "User fetched successfully", user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const data = req?.body;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: data,
    omit: { password: true },
  });

  return res.json(
    new ApiResponse(
      200,
      `Data of user with id: ${id} updated successfully`,
      updatedUser,
    ),
  );
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const isUserExists = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  const isAdmin = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { role: true },
  });

  if (!isAdmin) {
    throw new AppError("Permission prohibited", 500);
  }

  if (!isUserExists) {
    throw new AppError("User does not exists to delete", 404);
  }

  const deleteUser = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  if (!deleteUser) {
    return res.status(400).json({ message: "Failed to delete user." });
  }

  return res.json(new ApiResponse(200, "User deleted successfully"));
});

export const deleteAllUser = asyncHandler(async (req, res) => {
  const { id } = await req?.params;
  const isAdmin =
    "ADMIN" ==
    prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { role: true },
    });
  if (!isAdmin) {
    throw new AppError("Permission prohibited", 500);
  }
  const deleteUsers = prisma.user.deleteMany();

  if (!deleteAllUser) {
    return new AppError("Failed to delete all users", 500);
  }

  return res.json(new ApiResponse(201, "All users deleted"));
});

import prisma from "../config/prisma.config.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ omit: { password: true } });
  return res.json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
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
    where: { id: Number(id) },
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
    where: { id: Number(id) },
  });

  const isAdmin = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { role: true },
  });

  if (!isAdmin) {
    throw new AppError("Permission prohibited", 500);
  }

  if (!isUserExists) {
    throw new AppError("User does not exists to delete", 404);
  }

  const deleteUser = await prisma.user.delete({
    where: { id: Number(id) },
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
      where: { id: Number(id) },
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

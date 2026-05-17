import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerStore = asyncHandler(async (req, res) => {
  const { name, email, address, ownerId } = req?.body;

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });

  if (!owner) {
    throw new AppError("User not found", 404);
  }

  if (owner.role !== "STORE_OWNER") {
    throw new AppError("User is not a store owner", 400);
  }

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId: ownerId,
    },
  });

  return res.json(new ApiResponse(201, "Store registered successfully", store));
});

export const getAllStores = asyncHandler(async (req, res) => {
  const stores = await prisma.store.findMany();

  return res.json(new ApiResponse(200, "Stores fetched successfully", stores));
});

export const getStores = asyncHandler(async (req, res) => {
  const { id, name, address, ownerId } = req?.query;

  const where = {};

  if (id) {
    where.id = Number(id);
  }

  if (name) {
    where.name = {
      contains: name,
    };
  }

  if (address) {
    where.address = {
      contains: address,
    };
  }

  if (ownerId) {
    where.ownerId = Number(ownerId);
  }

  const stores = await prisma.store.findMany({ where });
  return res.json(new ApiResponse(200, "Stores fetched successfully", stores));
});

export const deleteStore = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteStore = await prisma.store.delete({ where: { id: Number(id) } });

  return res.json(new ApiResponse(201, "Store deleted successfully"));
});

export const updateStore = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const data = req?.body;

  const updatedStore = await prisma.store.update({
    where: { id: Number(id) },
    data: data
  });

  return res.json(new ApiResponse(201, "Store updated successfully",updatedStore));
});

export const deleteAllStores = asyncHandler(async (req, res) => {

  const deleteStores = await prisma.store.deleteMany();

  return res.json(new ApiResponse(201, "Store updated successfully",deleteStores));
});


import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalRatings = await prisma.rating.count();
  const totalStores = await prisma.store.count();

  return res.json(
    new ApiResponse(200, "Stats fetched successfully", {
      totalUsers,
      totalRatings,
      totalStores,
    }),
  );
});

export const getUsers = asyncHandler(async (req, res) => {
  const { name, email, address, role } = req?.query;
  const where = {};

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

  if (email) {
    where.email = {
      contains: email,
    };
  }
  if (role) {
    where.role = role
  }


  const users = await prisma.user.findMany({
    where,
  });

  return res.json(new ApiResponse(200, "Users fetched successfully", users));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ omit: { password: true } });
  return res.json(new ApiResponse(200, "Users fetched successfully", users));
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

export const registerStore = asyncHandler(async (req, res) => {
  const { name, email, address, ownerId } = req?.body;

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });

  if (!owner) {
    throw new AppError("User not found", 404);
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

  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: {
        select: { value: true },
      },
    },
  });

  const storesWithRating = stores.map((store) => {
    const totalRatings = store.ratings.length;
    const averageRating =
      totalRatings > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
        : 0;

    return {
      ...store,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings,
      ratings: undefined,
    };
  });

  return res.json(
    new ApiResponse(200, "Stores fetched successfully", storesWithRating),
  );
});

export const deleteStore = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteStore = await prisma.store.delete({ where: { id: Number(id) } });

  return res.json(
    new ApiResponse(200, "Store deleted successfully", deleteStore),
  );
});

export const updateStore = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { name, email, address } = req?.body;

  const updatedStore = await prisma.store.update({
    where: { id: Number(id) },
    data: { name, email, address },
  });

  return res.json(
    new ApiResponse(200, "Store updated successfully", updatedStore),
  );
});

export const deleteAllStores = asyncHandler(async (req, res) => {
  const deleteStores = await prisma.store.deleteMany();

  return res.json(
    new ApiResponse(200, "Store updated successfully", deleteStores),
  );
});

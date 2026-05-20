import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";


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

  // const stores = await prisma.store.findMany({ where });
  // return res.json(new ApiResponse(200, "Stores fetched successfully", stores));

  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: {
        select: { value: true },
      },
    },
  });

  // ✅ Calculate averageRating for each store
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



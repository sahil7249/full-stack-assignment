import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getOwnerDashBoard = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const stores = await prisma.store.findMany({
    where: { ownerId: Number(id) },
  });

  if (!stores) {
    throw new AppError("No store found for this owner", 404);
  }
  const ratings = await prisma.rating.findMany({
    where: { storeId: store.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
      : 0;

  const data = {
    store: {
      ...stores,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings,
    },
    ratings,
  };

  return res.json(
    new ApiResponse(200, "Owner dashboard fetched successfully", stores),
  );
});

import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const rateStore = asyncHandler(async (req, res) => {
  const { storeId } = req?.params;
  const { value } = req?.body;

  const store = await prisma.store.findUnique({
    where: { id: Number(storeId) },
  });

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId: req.user.id,
        storeId: Number(storeId),
      },
    },
  });

  let rating;
  if (existingRating) {
    rating = await prisma.rating.update({
      where: {
        id: existingRating.id,
      },
      data: { value },
    });
  } else {
    rating = await prisma.rating.create({
      data: {
        value,
        userId: req.user.id,
        storeId: Number(storeId),
      },
    });
  }
  return res.json(new ApiResponse(200, "Rated store successfully", rating));
});

export const getAllRatings = asyncHandler(async (req, res) => {
  const ratings = await prisma.rating.findMany();
  if (!ratings) {
    throw new AppError("Stores not found", 404);
  }
  return res.json(
    new ApiResponse(200, "Rating data fetched successfully", ratings),
  );
});

const getStats = async (storeId) => {
    const stats = await prisma.rating.aggregate({
        where : {
            storeId : storeId
        },
        _avg : { value : true },
        _count : { value : true }
    })
    return stats
}

export const getRatingsByStore = asyncHandler(async (req, res) => {
  const { storeId } = req?.params;
  const ratings = await prisma.rating.findMany({
    where: { storeId: Number(storeId) },
    include:{
        user:{
            select:{
                id:true,
                name:true
            }
        }
    }
  });

  const stats = await getStats(Number(storeId))

  if (!ratings) {
    throw new AppError("No ratings found", 404);
  }

  const data = {
    ratings,
    stats
  }


  return res.json(
    new ApiResponse(200, "Rating data fetched successfully", data),
  );
});

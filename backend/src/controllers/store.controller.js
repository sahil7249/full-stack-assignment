import prisma from "../config/prisma.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerStore = asyncHandler(async (req, res) => {
  //   const { id } = req?.params;

  const { name, email, address, ownerId } = req?.body;

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });

  if(!owner) {
    throw new AppError("User not found",404)
  }

  if(owner.role !== 'STORE_OWNER') {
    throw new AppError("User is not a store owner",400)
  }

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId : ownerId
    },
  });

  return res.json(new ApiResponse(201, "Store registered successfully", store));
});

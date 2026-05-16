import prisma from "../config/prisma.config";
import ApiResponse from "../utils/ApiResponse";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

export const registerStore = asyncHandler(async (req, res) => {
  const { id } = req?.params;

  const { name, email, address } = req?.body;

  const role = await prisma.user.findUnique({ where: id, select: { role } });
  const isValid = role == "STORE_OWNER" || role == "ADMIN";
  if (!isValid) {
    throw new AppError("Permission prohibited", 500);
  }

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
    },
  });

  return res.json(
    new ApiResponse(
        201,
        "Store registered successfully",
        store
    )
  )
});

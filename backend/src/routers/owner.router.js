import { Router } from "express";
import { getOwnerDashBoard } from "../controllers/owner.controller.js";

const ownerRouter = Router();

ownerRouter.get("/dashboard", getOwnerDashBoard);

export default ownerRouter;

import { Router } from "express";
import {  getStores  } from "../controllers/store.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const storeRouter = Router()

storeRouter.get('/',authenticate,getStores)

export default storeRouter;
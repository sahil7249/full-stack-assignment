import { Router } from "express";
import { registerStore } from "../controllers/store.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const storeRouter = Router()

storeRouter.post('/register',authenticate,registerStore)

export default storeRouter;
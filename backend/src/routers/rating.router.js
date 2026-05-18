import { Router } from 'express'
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { getAllRatings, getRatingsByStore, rateStore } from '../controllers/rating.controller.js';


const ratingRouter = Router()

ratingRouter.post('/:storeId',authenticate,rateStore)
ratingRouter.get('/',authenticate,authorize("ADMIN","STORE_OWNER"),getAllRatings)
ratingRouter.get('/:storeId',authenticate,authorize("ADMIN","STORE_OWNER"),getRatingsByStore)

export default ratingRouter
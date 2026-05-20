import { Router } from "express";
import { deleteAllStores, deleteStore, getAllStores,  getStores, registerStore, updateStore } from "../controllers/store.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const storeRouter = Router()

storeRouter.post('/register',authenticate,authorize("ADMIN"),registerStore)
storeRouter.get('/',authenticate,getStores)
// storeRouter.get('/',authenticate,getAllStores)
storeRouter.put('/:id',authenticate,updateStore)
storeRouter.delete('/:id',authenticate,authorize("ADMIN"),deleteStore)
storeRouter.delete('/',authenticate,authorize("ADMIN"),deleteAllStores)

export default storeRouter;
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware.js'
import { getAllUsers, getStats, getStores } from '../controllers/admin.controller.js'

const adminRouter = Router()


adminRouter.get('/stats',authenticate,authorize("ADMIN"),getStats)
adminRouter.get('/users',authenticate,authorize("ADMIN"),getAllUsers)
adminRouter.get('/stores',authenticate,authorize("ADMIN"),getStores)

export default adminRouter
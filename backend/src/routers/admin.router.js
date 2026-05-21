import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware.js'
import { getAllUsers, getStats, getStores, getUserById, getUsers } from '../controllers/admin.controller.js'
import { register } from '../controllers/auth.controller.js'

const adminRouter = Router()


adminRouter.post('/users/new',authenticate,authorize("ADMIN"),register)
adminRouter.get('/users/:id',authenticate,authorize("ADMIN"),getUserById)
adminRouter.get('/stats',authenticate,authorize("ADMIN"),getStats)
adminRouter.get('/users',authenticate,authorize("ADMIN"),getUsers)
adminRouter.get('/stores',authenticate,authorize("ADMIN"),getStores)

export default adminRouter
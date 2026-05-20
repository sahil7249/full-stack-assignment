import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, updateUser } from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.put('/:id',updateUser)
userRouter.delete('/:id',deleteUserById)
userRouter.get('/all',getAllUsers)
userRouter.get('/:id',getUserById)


export default userRouter;
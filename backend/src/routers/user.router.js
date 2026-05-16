import { Router } from "express";
import { registerUser, deleteUserById, getAllUsers, getUserById, updateUser, loginUser } from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.post('/user/register',registerUser)
userRouter.post('/user/login',loginUser)
userRouter.put('/user/:id',updateUser)
userRouter.delete('/user/:id',deleteUserById)
userRouter.get('/user/all',getAllUsers)
userRouter.get('/user/:id',getUserById)


export default userRouter;
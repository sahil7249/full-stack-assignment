import { Router } from "express";
import { registerUser, deleteUserById, getAllUsers, getUserById, updateUser, loginUser } from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.put('/:id',updateUser)
userRouter.delete('/:id',deleteUserById)
userRouter.get('/all',getAllUsers)
userRouter.get('/:id',getUserById)


export default userRouter;
import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUserDetails } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.get("/", getUsers)
userRouter.get("/:id",authorize, getUser)
userRouter.put("/:id",authorize, updateUserDetails)
userRouter.delete("/:id",authorize, deleteUser)

export default userRouter
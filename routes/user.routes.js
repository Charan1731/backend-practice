import { Router } from "express";

const userRouter = Router()

userRouter.get("/", (req,res) => res.send({title:'Get all users'}))
userRouter.get("/:id", (req,res) => res.send({title:'Get user detials'}))
userRouter.post("/", (req,res) => res.send({title:'create new users'}))
userRouter.put("/:id", (req,res) => res.send({title:'Update users'}))
userRouter.delete("/:id", (req,res) => res.send({title:'Delete users'}))

export default userRouter
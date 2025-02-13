import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getSubscriptions,getSubscription, deleteSubscription, editSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get("/" , (req,res) => { res.send({title:"Get all subsctiption"})})
subscriptionRouter.get("/:id" ,authorize, getSubscription )
subscriptionRouter.post("/" ,authorize, createSubscription)
subscriptionRouter.put("/:id" , authorize, editSubscription)
subscriptionRouter.delete("/:id" ,authorize, deleteSubscription)
subscriptionRouter.get("/user/:id" ,authorize, getSubscriptions )
subscriptionRouter.put("/:id/cancel" , (req,res) => { res.send({title:"Cancel subsctiption"})})
subscriptionRouter.get("/upcomin-renewals" , (req,res) => { res.send({title:"Get upcoming renewals"})})

export default subscriptionRouter
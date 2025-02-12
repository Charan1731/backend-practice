import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get("/" , (req,res) => { res.send({title:"Get all subsctiption"})})
subscriptionRouter.get("/:id" , (req,res) => { res.send({title:"Get subsctiption details"})})
subscriptionRouter.post("/" ,authorize, createSubscription)
subscriptionRouter.put("/:id" , (req,res) => { res.send({title:"update a subsctiption"})})
subscriptionRouter.delete("/:id" , (req,res) => { res.send({title:"delete a subsctiption"})})
subscriptionRouter.get("/user/:id" ,authorize, getSubscriptions )
subscriptionRouter.put("/:id/cancel" , (req,res) => { res.send({title:"Cancel subsctiption"})})
subscriptionRouter.get("/upcomin-renewals" , (req,res) => { res.send({title:"Get upcoming renewals"})})

export default subscriptionRouter
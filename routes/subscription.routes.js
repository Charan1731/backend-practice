import { Router } from "express";

const subscriptionRouter = Router()

subscriptionRouter.get("/" , (req,res) => { res.send({title:"Get all subsctiption"})})
subscriptionRouter.get("/:id" , (req,res) => { res.send({title:"Get subsctiption details"})})
subscriptionRouter.post("/" , (req,res) => { res.send({title:"create a subsctiption"})})
subscriptionRouter.put("/:id" , (req,res) => { res.send({title:"update a subsctiption"})})
subscriptionRouter.delete("/:id" , (req,res) => { res.send({title:"delete a subsctiption"})})
subscriptionRouter.get("/user/:id" , (req,res) => { res.send({title:"Get users all subsctiption"})})
subscriptionRouter.put("/:id/cancel" , (req,res) => { res.send({title:"Cancel subsctiption"})})
subscriptionRouter.get("/upcomin-renewals" , (req,res) => { res.send({title:"Get upcoming renewals"})})

export default subscriptionRouter
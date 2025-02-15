import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
              subscriptionId: subscription.id,
            },
            headers: {
              'content-type': 'application/json',
            },
            retries: 0,
          })

        res.status(201).json({ success:true,data: subscription,workflowRunId });
    } catch (error) {
        next(error)
    }
}

export const getSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id){
            const error = new Error('Cannot find user');
            error.status = 404;
            throw error;
        }

        const subscription = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success:true,data: subscription });
    } catch (error) {
        next(error)
    }
}

export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success:true,data: subscription });
    } catch (error) {
        next(error)
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        if(req.user.id.toString() !== subscription.user.toString()){
            const error = new Error('Unauthorized');
            error.status = 401;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.id);
        res.status(200).json({ success:true,data: subscription });
    } catch (error) {
        next(error)
    }
}

export const editSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        if(req.user.id.toString() !== subscription.user.toString()){
            const error = new Error('Unauthorized');
            error.status = 401;
            throw error;
        }
        const subscriptionUpdate = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json({ success:true,data: subscriptionUpdate });
    } catch (error) {
        next(error)
    }
}
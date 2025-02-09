import mongoose from "mongoose";
import User from "./user.model";

const subscriptionScheme = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength:1000
    },
    currency:{
        type:String,
        enum: ['USD', 'INR', "GBP"],
        default:'USD'
    },
    price:{
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than zero"]
    },
    frequency:{
        type: String,
        enum:['daily','weekly','monthly','yearly']
    },
    category:{
        type:String,
        enum:['Entertainment', 'Education', 'Health', 'Fitness', 'Productivity', 'Utilities', 'Other'],
        required:true
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active'
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator: (value) => value <= new Date(),
            message:'Start date must be in the past'
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator: function(value){return value > this.startDate;},
            message:'Renewal date must be in the future'
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true,
    }
},{timestamps:true})

subscriptionScheme.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        }
        this.renewalDate = new Date(this.startDate).setDate(this.startDate.getDate() + renewalPeriods[this.frequency])
    }
    if(this.renewalDate<new Date()) this.status = 'expired';

    next();
})

const Subscription = mongoose.model("Subscription", subscriptionScheme)

export default Subscription
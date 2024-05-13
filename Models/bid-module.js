import { Schema, model } from "mongoose";

const bidSchema = new Schema({
    productId:{
        type:String,
    },
    userId:{
        type:String,
    },
    current_bidding_price:{
        type:Number,
    },
    createdDate:{
        type: Date,
    },
    updatedDate:{
        type: Date,
    },
})

export const BidData = new model("BiddingData",bidSchema)
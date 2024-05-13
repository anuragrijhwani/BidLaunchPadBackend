import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    product_id:{
        type:String,
    },
    user_id:{
        type:String,
    },
    address:{
        type:String,
    },
    payment_data:{
        type:String,
    }
})

export const OrdersData = new model("OrderData",orderSchema)
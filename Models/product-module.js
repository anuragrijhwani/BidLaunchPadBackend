import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDesc: {
    type: String,
    required: true,
  },
  productImages: {
    type: String,
    data:Buffer,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  product_IncreasePrice: {
    type:Number,
    required:true,
  },
  product_createDate: {
    type: Date,
  },
  product_CreatedBy:{
    type:String,
  },
  bidStarting_time:{
    type: Date,
    required:true,
  },
  current_bidder:{
    type: String,
  },
  current_bidding_price:{
    type:Number,
  },
  updatedDate:{
    type: Date,
  },
  bidBy_user_id:{
    type: String,
  },
  bidStatus:{
    type:String,
  }
});

export const ProductData = new model("Product",ProductSchema);
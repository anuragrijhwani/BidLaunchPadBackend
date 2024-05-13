import { OrdersData } from "../Models/order-module.js";
import { ProductData } from "../Models/product-module.js";

export const order = async (req, res) => {
  const { product_id, user_id, address, payment_data ,status } = req.body;

  const data = await OrdersData.create({
    product_id,
    user_id,
    address,
    payment_data,
  });
  if(data)
  {
    const updateStatus = await ProductData.updateOne(
      { _id: product_id },
      {
        $set: {
          bidStatus:status
        }
      }
    ) 
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: data,
  });
};

export const orderData = async (req, res) => {
  const product_id = req.body._id;

  try {

    const Data = await OrdersData.findOne({product_id})
    if(!Data)
    {
      return  res.status(400).json({
        message: "No Order Found",
    })
    }
    res.status(200).json({
      message:"Data Found",
      data:Data,
    })
    
  } catch (error) {
    console.log("error found in fetching order",error);
  }

 
}
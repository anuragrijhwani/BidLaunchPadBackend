import { response } from "express";
import { BidData } from "../Models/bid-module.js";
import { ProductData } from "../Models/product-module.js";

export const bid = async (req, res) => {
  try {
    const { productId, userId, current_bidding_price, current_bidder } =
      req.body;
    const createdDate = new Date();
    const updatedDate = new Date();

    const biddingData = await BidData.create({
      productId,
      userId,
      current_bidding_price,
      createdDate,
      updatedDate,
    });

    if (biddingData) {
      const curData = await ProductData.updateOne(
        { _id: productId },
        {
          $set: {
            current_bidder: current_bidder,
            updatedDate: updatedDate,
            current_bidding_price: current_bidding_price,
          },
        }
      );
      res.status(200).json({
        status: 200,
        message: "both done",
        data: curData,
        data1: biddingData,
      });
    }
  } catch (error) {
    console.log("error from bidding data side", error);
  }
};

export const getBid = async (req, res) => {
  const userId = req.body.userId;
  try {

    const bidData = await BidData.find({ userId });

    const productIds = bidData.map((bid) => bid.productId);

    const productData = await ProductData.find({ _id: { $in: productIds } });


    if (productData.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching product data found." });
    }

    let bidArr = [];
    bidData?.map((itm) => {
      bidArr.push({
        ...itm?._doc,
        productInfo: productData?.filter((item) => item?._id == itm?.productId)?.[0],
      });
    });


    res.status(200).json({
      BidsData: bidArr,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

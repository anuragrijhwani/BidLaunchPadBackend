import { BidData } from "../Models/bid-module.js";
import { Contact } from "../Models/contact-module.js";
import { OrdersData } from "../Models/order-module.js";
import { ProductData } from "../Models/product-module.js";
import { User } from "../Models/user-models.js";

export const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find({isAdmin:false}, { password: 0 });
    if (!User || User.length === 0) {
      return res.status(404).json({
        message: "No User Found",
      });
    }
    res.status(200).json({
      message: "all Contact data fetched",
      data: Users,
    });
  } catch (error) {
    console.log("Error fetching User data", error);
  }
};

export const getAllContact = async (req, res) => {
  try {
    const contact = await Contact.find();
    if (!contact || contact.length === 0) {
      return res.status(404).json({
        message: "No User Found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "all User data fetched",
      data: contact,
    });
  } catch (error) {
    console.log("Error fetching Contact data", error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const _id = req.body;
    await User.deleteOne({ _id });
    res.status(200).json({
      message: "User data deleted successfully",
    });
  } catch (error) {
    console.log("error in deleting users data".error);
  }
};

export const getUserById = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.body;
    const userData = await User.findOne({ _id }, { password: 0 });
    res.status(200).json({
      message: "user Data Fetched",
      data: userData,
    });
  } catch (error) {
    console.log("error from fetching user data for admin", error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id, username, email, phone } = req.body;
    const userExist = await User.findOne({ email: email });
    if (userExist?.email == email || !userExist) {
      const Update = await User.updateOne(
        { _id: _id },
        {
          $set: {
            username: username,
            email: email,
            phone: phone,
          },
        }
      );
      return res.status(200).json({
        message: "data updated",
        data: Update,
      });
    } else {
      return res.status(400).json({ message: "Email already exist" });
    }
  } catch (error) {
    console.log("error in updating data", error);
    return res
      .status(400)
      .json({ message: "Something went wrong! Try again after some time" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const query = {
      bidStatus:  "order" ,
    };
    const data = await ProductData.find(query);
    let resArr = [];
    data.map((itm) => {
      resArr.push({
        imagePath: "http://localhost:5000/uploads/",
        ...itm?._doc,
      });
    });
    if (!resArr) {
      res.status(400).json({ message: "No product Found" });
    }
    res.status(200).json({
      message: "data fetched",
      data: resArr,
    });
  } catch (error) {
    console.log(error);
  }
};

export const biddingData = async (req, res) => {
  const productId = req.body.productId;
  try {
    const bidData = await BidData.find({ productId });

    const userIds = bidData.map((bid) => bid.userId);

    const userData = await User.find({ _id: { $in: userIds } });

    if (userData.length === 0) {
      return res.status(404).json({ message: "No matching user data found." });
    }

    let bidArr = [];
    bidData?.map((itm) => {
      bidArr.push({
        ...itm?._doc,
        productInfo: userData?.filter(
          (item) => item?._id == itm?.userId
        )?.[0],
      });
    });

    // const response = bidData.map((bid) => ({
    //   bid: bid,
    // //   user: userMap[bid.userId],
    // data:bidArr
    // }));

    res.status(200).json({
      message: "Data fetched",
      biddingData: bidArr,
    });
  } catch (error) {
    console.error("Error in fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

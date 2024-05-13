import { User } from "../Models/user-models.js";
import bcrypt from "bcryptjs";
import { ProductData } from "../Models/product-module.js";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";


// Home Logic

export const home = (req, res) => {
  try {
    res.status(200).send("welcome Home from router");
  } catch (error) {
    res.status(400).send({ message: "page not found" });
  }
};

// Registration logic

export const registration = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
      const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const SaltRound = await bcrypt.genSalt(10);
    const Hash_password = await bcrypt.hash(password, SaltRound);
    const data = await User.create({
      username,
      email,
      phone,
      password: Hash_password,
    });

    res.status(200).json({
      status: 200,
      message: "success",
      Token: await data.generateToken(),
      userId: await data._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: "page not found",error });
  }
};

// Login logic

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const PassMatch = await bcrypt.compare(password, userExist.password);

    if (PassMatch) {
      res.status(200).json({
        status: 200,
        message: "Login successful",
        Token: await userExist.generateToken(),
        userId: await userExist._id.toString(),
        data: await userExist,
      });
    } else {
      return res.status(400).json({ message: "Invalid Email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: "page not found" });
  }
};

//Add Product Logic

export const AddProduct = async (req, res) => {
  let imageData = req.files.map((itm) => {
    return itm.filename;
});
  try {
    const {
      productName,
      productDesc,
      productPrice,
      product_IncreasePrice,
      product_CreatedBy,
      bidStarting_time
    } = req.body;

    const product_createDate = new Date(); 
    const productImages =imageData.toString();
    const bidStatus = "coming";

    const ProData = await ProductData.create({
      productName,
      productDesc,
      productImages,
      productPrice,
      product_IncreasePrice,
      product_createDate,
      product_CreatedBy,
      bidStarting_time,
      bidStatus
    });

    res.status(200).json({
      status: 200,
      message: ProData,
      userId: await ProData._id.toString(),
    });
    

  } catch (error) {
    console.log("error from product side", error);
  }
};

// user logic

export const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`error from user route ${error}`);
  }
};

//fetch all user Data
export const getUser = async (req,res) => {
 
  try {
      const _id = req.body;
      const userData = await User.findOne(_id,{password:0})
      res.status(200).json({
          message:"user Data Fetched",
          data:userData,
      })
  } catch (error) {
      console.log("error from fetching user data for admin",error);   
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { _id, oldPassword,newPassword } = req.body;
    const userData = await User.findOne({ _id });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

    if (isPasswordValid) {
      const saltRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltRound);
      await User.updateOne(
        { _id: _id },
        {
          $set: {
           password:hashedPassword,
          },
        }
      )
      res.status(200).json({
        message:"data Updated",
      })
    } else {
      console.log("Old Password is not matched");
      return res.status(400).json({ message: "Old Password is not matched" });
    }
  } catch (error) {
    console.log("Error in updating password:", error);
    res.status(400).json({ message: "something went wrong" });
  }
};

export const BidWinner = async (req,res) => {
  try {
    const query = {
      bidBy_user_id:req.body.user_id,
      bidStatus:{ $in: ["win", "order"] },
    }

    const data = await ProductData.find(query)
    let resArr=[]
    data.map((itm)=>{
            resArr.push({imagePath : "http://localhost:5000/uploads/",...itm?._doc})
        })
        if(!resArr){
            res.status(400).json({message:"No product Found"}); 
        }
    res.status(200).json({
      message:"data fetched",
      data:resArr,
    })
    
  } catch (error) {
    console.log(error);
  }
}


export const userProduct = async(req,res) => {
  try {
    const product_CreatedBy = req.body;
    const data = await ProductData.find(product_CreatedBy)

    let resArr=[]
    data.map((itm)=>{
            resArr.push({imagePath : "http://localhost:5000/uploads/",...itm?._doc})
        })

    res.status(200).json({
      message:"data fetched",
      data:resArr,
    })
  } catch (error) {
    console.log("error in user data fetched",error);
  }
} 

// forgotPassword logic

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: 'anu22102002@gmail.com',
    pass: 'tmgn qyal lrha pjfy'
  }
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Email doesn't exist!" });
    }

    // Generate a unique token for password reset link
    const resetToken = jwt.sign({ email: userExist.email }, process.env.JWT_T, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    // Store the reset token in the database for the user
    userExist.resetPasswordToken = resetToken;
    userExist.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await userExist.save();

    // Send the reset password link to the user via email
    const resetLink = `http://localhost:5173/changePassword/${resetToken}`;

    const mailOptions = {
      from: 'anu22102002@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `Click <b><a href="${resetLink}">here</a></b> to reset your <b>BidLaunchPad</b> Account password. This link will expire in 1 hour.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log('Email sent:', info.response);
        console.log("Reset token:", resetToken); // Log reset token
        return res.status(200).json({ message: "Email sent successfully" });
      }
    });

  } catch (error) {
    console.log('Error occurred:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const verifyTkn = jwt.verify(token, process.env.JWT_T);

    // Find user by email from token
    const userData = await User.findOne({ email: verifyTkn.email });
    console.log(userData);

    if (!userData) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Reset password
       const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);
    userData.password = hashedPassword;
    userData.resetPasswordToken = undefined;
    userData.resetPasswordExpires = undefined;
    await userData.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.log('Error occurred:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Token has expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
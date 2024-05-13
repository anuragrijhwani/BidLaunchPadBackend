import { ProductData } from "../Models/product-module.js";
import { User } from "../Models/user-models.js";

export const productForm = async (req,res) => {

    try {
        let response = await ProductData.find({bidStatus:{ $in: ["coming", "start"] }},);
        let resArr=[]
        response.map((itm)=>{
            resArr.push({imagePath : "http://localhost:5000/uploads/",...itm?._doc})
        })
        if(!resArr){
            res.status(400).json({message:"No product Found"}); 
        }
        res.status(200).json({message:resArr})
    } catch (error) {
        console.log("error from product side",error);
    }
}

export const productDetails = async(req,res)=>{
    try {
        const { _id } = req.body;
        let productData = await ProductData.findOne({ _id });
        console.log(productData);
        if(productData)
        {
            const  _id  = productData.product_CreatedBy
            let userData = await User.findOne({_id},{password:0});
            console.log(" Data",userData);
            const mergeData = {imagePath:"http://localhost:5000/uploads/",uploadByUser:userData,...productData?._doc}
            res.status(200).json({
                status: 200,
                message: "particular data fetched",
                data : mergeData,
                
            })
        }
        else{
            console.log(error)
        }
    } catch (error) {
        console.log("error from product details",error);
    }
}

export const productDelete = async (req,res) =>{

    try {
        const _id =req.body;
        await ProductData.deleteOne({_id})
        res.status(200).json({
            message:"Product deleted successfully",
        })
    } catch (error) {
     console.log("error in deleting Product".error);   
    }
}

export const productEdit = async (req,res) => {
    try {
        const _id = req.body;
        const data = await ProductData.find({_id})
        res.status(200).json({
            message:"data fetched for edit",
            data:data
        })
    } catch (error) {
        
    }
}

export const productStatusUpdate = async (req , res) => {
    try {
        const _id = req.body._id;
        const status = req.body.bidStatus;
        const data = await ProductData.find({_id})
        if(data)
        {
            if(data.bidStatus == status)
            {
                res.status(200).json({
                    message:"Status updated"
                })
            }
            else{
            await ProductData.updateOne(
                { _id},
                {
                  $set: {
                    bidStatus : status,
                  }
                }
            )
            res.status(200).json({
                message:"Status Updated"
            })
        }
        }
    } catch (error) {
        console.log("error in updating status",error);
        res.status(400).json({
            message:"error in update status"
        })
    }
}

export const productUpdate = async (req, res) => {
    const _id = req.body._id;
    let imageData = req.files.map((itm) => {
      console.log("img data",itm.filename);
      return itm.filename;
    });
    const removedImage = req.body.removedImages;
    try {
      const {
        productName,
        productDesc,
        productPrice,
        product_IncreasePrice,
        bidStarting_time,
      } = req.body;
  
      let imgData;
      const Image = imageData.toString();
  
      if (req.body.productImages && Image ) {
        imgData = Image + "," + req.body.productImages;
      }
       else if (req.body.productImages)
      {
        imgData = req.body.productImages;
      }
      else 
      {
        imgData = Image;
      }
      
      const existingProduct = await ProductData.updateOne(
        { _id },
        {
          $set: {
            productName: productName,
            productDesc: productDesc,
            productPrice: productPrice,
            product_IncreasePrice: product_IncreasePrice,
            bidStarting_time: bidStarting_time,
            productImages: imgData
          },
        },
      );
      res.status(200).json({
        status: 200,
        message: "Product updated successfully",
        productId: existingProduct._id,
      });
    } catch (error) {
      console.log("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
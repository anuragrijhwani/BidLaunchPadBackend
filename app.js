import "dotenv/config";
import http from "http";
import express from "express";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

import Cors from "cors";
import authRoute from "./router/auth-router.js";
import contactRoute from "./router/contact-router.js";
import productRoute from "./router/product-router.js";
import addProductRoute from "./router/addProduct-router.js";
import bidRoute from "./router/bid-router.js";
import adminRoute from "./router/admin-router.js";
import orderRoute from "./router/order-router.js"
import { connectDB } from "./Utils/db.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { BidData } from "./Models/bid-module.js";
import { ProductData } from "./Models/product-module.js";

const CorsOption = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  Credentials: true,
};

app.use(Cors(CorsOption));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/form", contactRoute);
app.use("/api/add", addProductRoute);
app.use("/api/data", productRoute);
app.use("/api/bidding", bidRoute);
app.use("/api/admin",adminRoute);
app.use("/api/order",orderRoute);
app.use(errorMiddleware);

const io = new Server(server, { cors: CorsOption });

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", () => {
    console.log("user Disconnected");
  });

  socket.on("bidSendFE", async (params) => {
    console.log(params);
    const createdDate = new Date();
    const updatedDate = new Date();

    const biddingData = await BidData.create({
      productId:params?.productId,
      userId:params?.userId,
      current_bidding_price:params?.current_bidding_price,
      createdDate,
      updatedDate,
    });

    if (biddingData) {
      const curData = await ProductData.updateOne(
        { _id: params?.productId },
        {
          $set: {
            current_bidder: params?.current_bidder,
            updatedDate,
            current_bidding_price: params?.current_bidding_price,
            bidBy_user_id:params?.userId,
          },
        }
      );
      io.emit("bidSendBE", {
        productId: params?.productId,
        current_bidding_price: params?.current_bidding_price,
        current_bidder: params?.current_bidder,
        userId:params?.userId,
        updatedDate,
      });
      console.log(curData);
    }
    
  
  });
});

connectDB().then(() => {
  const port = process.env.PORT ||5000;
  server.listen(port, () => {
    console.log(`server is running on port: ${port} `);
  });
});

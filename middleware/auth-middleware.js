import jwt from "jsonwebtoken";
import { User } from "../Models/user-models.js";

export const authMiddleware = async (req, res, next) => {
  const Token = req.header("Authorization");

  if (!Token) {
    return res
      .status(401)
      .json({ message: "unauthorized , Token not provided  " });
  }

  const jwtToken = Token.replace("Bearer ", " ").trim();

  try {
    const verifyTkn = jwt.verify(jwtToken,process.env.JWT_T);

    const userData = await User.findOne({email:verifyTkn.email}).select({password:0})

    req.user = userData;
    req.Token = Token;
    req.userID = userData._id;
    
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "unauthorized , Token not provided  " });
  }
};

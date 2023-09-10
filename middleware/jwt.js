import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401,"You are not authenticated!"))
  const options = {
    httpOnly:true,
    
    
    expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *600 * 1000)
}


  jwt.verify(token, process.env.JWT_SECRET, options, async (err, payload) => {
    if (err) return next(createError(403,"Token is not valid!"))
    req.userId = payload.id;
  
    next()
  });
};
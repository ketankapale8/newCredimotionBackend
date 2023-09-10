import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 15);
    const otp = Math.floor(Math.random() * 1000000);
    const newUser = new User({
      ...req.body,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 60* 10000),
      password: hash,
    });

    await newUser.save();
    await sendMail(
        req.body.email,
        "Please verify your account for Credimotion",
        `Your OTP is ${otp}`
      );
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    // const { email , password} = req.body;

    const user = await User.findOne({ name : req.body.name });
    
    if (!user) return next(createError(404, "User not found!"));
    
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
    return next(createError(400, "Wrong password or username!"));
  
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
    );
    
    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    // res.status(500).send("Something went wrong..")
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
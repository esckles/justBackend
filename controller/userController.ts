import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../model/userModel";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");
    const user = await userModel.create({
      name,
      email,
      password: hashed,
      isVerifiedToken: token,
    });
    return res.status(201).json({
      message: "Account created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const VerifyAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndUpdate(userID, {
      isVerified: true,
      isVerifiedToken: "",
    });
    return res.status(201).json({
      message: "Account verified successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const LoginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const checked = await bcrypt.compare(password, user.password);
      if (checked) {
        if (user?.isVerified && user?.isVerifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES as string }
          );
          return res.status(200).json({
            message: "Account login successfully",
            data: user,
            status: 200,
          });
        } else {
          return res.status(404).json({ message: "error log in", status: 404 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Error with password", status: 404 });
      }
    } else {
      return res.status(404).json({ message: "Error with email", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error log in", status: 404 });
  }
};

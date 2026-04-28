import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { AuthReq } from "../types/express.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.userId = decoded.id ;

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};

export default authMiddleware;

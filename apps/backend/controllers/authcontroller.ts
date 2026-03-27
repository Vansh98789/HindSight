import type { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { prisma } from "../../../packages/db/db";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  if (!password || !email) {
    return res.status(401).json({
      msg: "need credentials"
    });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    res.status(201).json({
      message: 'Register successful!',
      received: { name, email }
    });
  } catch (error) {
    console.error("Register error:", error);
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!password || !email) {
    return res.status(401).json({
      msg: "need credentials"
    });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        msg: "no user exist, need to create user"
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({
        msg: "invalid credentials"
      });
    }
    
    const token = jwt.sign(
      { id: user.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
    });
    
    res.status(200).json({
      message: 'Login successful!',
      received: { email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
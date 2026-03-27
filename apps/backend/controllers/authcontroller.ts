import type {Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    res.status(201).json({
      message: 'Register controller works!',
      received: { name, email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    res.status(200).json({
      message: 'Login controller works!',
      received: { email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
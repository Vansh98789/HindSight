import { type Request, type Response } from 'express';
import { prisma } from '../../../packages/db/db';

export const submitReview = async (req: Request, res: Response) => {
  try {
    const decisionId   = req.params.decisionId as string;  
    const { outcome, reflection, reasoningGoodOrNot } = req.body;  
      await prisma.review.create({
        data:{
          decisionId,
          outcome,
          reflection,
          reasoningGoodOrNot
        }
      })
    res.status(201).json({
      message: 'Review submitted!',
      received: { decisionId, outcome, reflection, reasoningGoodOrNot }
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/reviews/:decisionId
export const getReview = async (req: Request, res: Response) => {
  try {
    const decisionId  = req.params.decisionId as string;  

    const decision=await prisma.review.findUnique({
      where:{
        decisionId
      }
    })

    res.status(200).json({
      msg:decision
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
import { type Request, type Response } from 'express';

// POST /api/reviews/:decisionId
export const submitReview = async (req: Request, res: Response) => {
  try {
    const { decisionId } = req.params;  // URL se aata hai
    const { outcome, reflection, reasoningGoodOrNot } = req.body;  // form se aata hai

    // abhi sirf confirm kar rahe hain ki data mila
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
    const { decisionId } = req.params;  // kis decision ka review chahiye

    // abhi sirf confirm kar rahe hain
    res.status(200).json({
      message: 'Get review!',
      decisionId
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
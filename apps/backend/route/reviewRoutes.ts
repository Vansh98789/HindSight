import { Router } from 'express';
import { submitReview, getReview } from '../controllers/reviewController';

const router = Router();

router.post('/:decisionId', submitReview);
router.get('/:decisionId', getReview);

export default router;
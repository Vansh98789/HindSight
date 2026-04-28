import { Router } from "express";
import { allDecision, createDecision, deleteDecision, editDecision, pendingDecision, singleDecision } from "../controllers/decisionController.js";

const router=Router();

router.post('/create',createDecision);
router.get('/all',allDecision);
router.get('/pending', pendingDecision);
router.get('/:id',singleDecision);
router.put('/:id',editDecision);
router.delete('/:id',deleteDecision);

export default router;

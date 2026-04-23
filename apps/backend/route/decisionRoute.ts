import { Router } from "express";
import { allDecision, createDecision, deleteDecision, editDecision, getPending, singleDecision } from "../controllers/decisionController";

const router=Router();

router.post('/create',createDecision);
router.get('/all',allDecision);
router.get("/pending",getPending);

router.get('/:id',singleDecision);
router.put('/:id',editDecision);
router.delete('/:id',deleteDecision);


export default router;
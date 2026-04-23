import type { Response } from "express";
import { prisma } from "../../../packages/db/db";
import type { AuthReq } from "../types/express";

interface decision {
  title: string;
  description: string;
  options: string[];
  choiceMade: string;
  reasoning: string;
  confidencelvl: number;
  emotionalState: string;
  category: string;
  stake: string;
  reviewDate: string; 
}

export const createDecision = async (req: AuthReq, res: Response) => {
  try {
    const {
      title,
      description,
      options,
      choiceMade,
      confidencelvl,
      emotionalState,
      stake,
      category,
      reviewDate,
      reasoning,
    }: decision = req.body;

    if (
      !title ||
      !description ||
      !choiceMade ||
      !reasoning ||
      !emotionalState ||
      !stake ||
      !category ||
      confidencelvl === undefined || 
      !reviewDate ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res.status(400).json({
        msg: "need to fill in the details",
      });
    }
    if (!req.userId) {
         return res.status(401).json({ msg: "unauthorized" });
    }


    const userId = req.userId;

    const decision = await prisma.decision.create({
      data: {
        userId,
        title,
        description,
        options,
        choiceMade,
        reasoning,
        confidencelvl,
        emotionalState: emotionalState as any, 
        category: category as any,
        stake: stake as any,
        reviewDate: new Date(reviewDate), 
      },
    });

    return res.status(201).json({
      msg: "decision created",
      decision,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "server error",
    });
  }
};


export const allDecision=async(req:AuthReq,res:Response)=>{
    const userId=req.userId;
    if(!userId){
        return res.status(401).json({
            msg:"Not authorized"
        })
    }
    try{
        const user_decision=await prisma.decision.findMany({
            where:{
                userId:userId
            }
        })
        return res.status(200).json({
            decision:user_decision
        })

    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            msg: "server error",
        });
    }

}

export const singleDecision=async(req:AuthReq,res:Response)=>{
    const userId=req.userId;
    if(!userId){
        return res.status(401).json({
            msg:"not authorized"
        })
    }
    try{
        const id=req.params.id as string;
        const user_decision=await prisma.decision.findFirst({
            where:{
                id,
                userId:userId
            }
        })
        if (!user_decision) {
            return res.status(404).json({
                msg: "decision not found",
            });
        }
        res.status(200).json({
            decision:user_decision
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            msg: "server error",
        });

    }
}

export const editDecision=async(req:AuthReq,res:Response)=>{
    const userId=req.userId;
    const {
      title,
      description,
      options,
      choiceMade,
      confidencelvl,
      emotionalState,
      stake,
      category,
      reviewDate,
      reasoning,
    }: Partial<decision> = req.body;

    if(!userId){
        return res.status(401).json({
            msg:"not authorized"
        })
    }
    try {
    const id = req.params.id as string;

    const data: any = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (options !== undefined) data.options = options;
    if (choiceMade !== undefined) data.choiceMade = choiceMade;
    if (reasoning !== undefined) data.reasoning = reasoning;
    if (confidencelvl !== undefined) data.confidencelvl = confidencelvl;

    if (emotionalState !== undefined)
        data.emotionalState = emotionalState as any;

    if (category !== undefined)
        data.category = category as any;

    if (stake !== undefined)
        data.stake = stake as any;

    if (reviewDate !== undefined)
        data.reviewDate = new Date(reviewDate);

    const updated = await prisma.decision.updateMany({
        where: {
        id,
        userId,
        },
        data,
    });

    if (updated.count === 0) {
        return res.status(404).json({
        msg: "decision not found",
        });
    }

    return res.status(200).json({
        msg: "your data is updated",
    });

} catch (e) {
  console.log(e);
  return res.status(500).json({
    msg: "server error",
  });
}

}

export const deleteDecision = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        msg: "not authorized",
      });
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        msg: "invalid id",
      });
    }

    const deleted = await prisma.decision.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        msg: "decision not found",
      });
    }

    return res.status(200).json({
      msg: "decision deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "server error",
    });
  }
};

export const getPending=async(req: AuthReq, res: Response)=>{
  try{
    const userId=req.userId;
      if (!userId) {
      return res.status(401).json({
        msg: "not authorized",
      });
    }
    const decision= await prisma.decision.findMany({
      where:{
        userId,
        pending:true,
      }
    }
    )
  return res.status(200).json({
    decision
  })

  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      msg: "server error",
    });
  }
}
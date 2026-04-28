import { type Response } from "express";

import { prisma } from "../../../packages/db/db.js";
import type { AuthReq } from "../types/express.js";



export const getSummary = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.userId 

    const totalDecisions = await prisma.decision.count({
      where: { userId },
    });

    const totalReviewed = await prisma.review.count({
      where: { decision: { userId } },
    });

    const pendingReviews = await prisma.decision.count({
      where: {
        userId,
        reviewDate: { lte: new Date() },
        review: null,
      },
    });

    const confidenceAgg = await prisma.decision.aggregate({
      where: { userId },
      _avg: { confidencelvl: true },
    });

    const outcomeAgg = await prisma.review.aggregate({
      where: { decision: { userId } },
      _avg: { outcome: true },
    });

    const avgConfidence = confidenceAgg._avg.confidencelvl ?? 0;
    const avgOutcome = outcomeAgg._avg.outcome ?? 0;
    const biasGap = parseFloat((avgConfidence - avgOutcome).toFixed(2));

    res.status(200).json({
      success: true,
      message: "Overall stats fetched successfully",
      data: {
        totalDecisions,
        totalReviewed,
        pendingReviews,
        avgConfidence: parseFloat(avgConfidence.toFixed(2)),
        avgOutcome: parseFloat(avgOutcome.toFixed(2)),
        biasGap,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBiasReport = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.userId;

    const reviewedCount = await prisma.review.count({
      where: { decision: { userId } },
    });

    if (reviewedCount < 5) {
      return res.status(200).json({
        success: true,
        data: {
          unlocked: false,
          reviewedCount,
          required: 5,
        },
      });
    }

    const decisions = await prisma.decision.findMany({
      where: { userId, review: { isNot: null } },
      include: { review: true },
    });

    const withGap = decisions.map((d) => ({
      title: d.title,
      confidence: d.confidencelvl,
      outcome: d.review!.outcome,
      gap: d.confidencelvl - d.review!.outcome,
      emotionalState: d.emotionalState,
      category: d.category,
    }));

    const avgGap =
      withGap.reduce((sum, d) => sum + d.gap, 0) / withGap.length;

    const topBiases = [];

    if (avgGap > 1.5) {
      topBiases.push({
        name: "Overconfidence Bias",
        description: `You rate confidence higher than outcomes by ${avgGap.toFixed(1)} points on average`,
        examples: withGap
          .sort((a, b) => b.gap - a.gap)
          .slice(0, 3)
          .map((d) => ({ title: d.title, confidence: d.confidence, outcome: d.outcome })),
      });
    }

    const categoryGaps: Record<string, number[]> = {};
    withGap.forEach((d) => {
      if (!categoryGaps[d.category]) categoryGaps[d.category] = [];
      categoryGaps[d.category]!.push(d.gap);
    });
    const categoryAvgGaps = Object.entries(categoryGaps).map(([cat, gaps]) => ({
      category: cat,
      avgGap: gaps.reduce((a, b) => a + b, 0) / gaps.length,
    }));
    const worstCategory = categoryAvgGaps.sort((a, b) => b.avgGap - a.avgGap)[0];
    if (worstCategory && worstCategory.avgGap > 2) {
      topBiases.push({
        name: `${worstCategory.category} Blind Spot`,
        description: `Your ${worstCategory.category.toLowerCase()} decisions have the biggest gap of ${worstCategory.avgGap.toFixed(1)}`,
        examples: withGap
          .filter((d) => d.category === worstCategory.category)
          .slice(0, 3)
          .map((d) => ({ title: d.title, confidence: d.confidence, outcome: d.outcome })),
      });
    }

    const emotionGaps: Record<string, number[]> = {};
    withGap.forEach((d) => {
      if (!emotionGaps[d.emotionalState]) emotionGaps[d.emotionalState] = [];
      emotionGaps[d.emotionalState]!.push(d.outcome);
    });
    const emotionAvg = Object.entries(emotionGaps).map(([emotion, outcomes]) => ({
      emotion,
      avgOutcome: outcomes.reduce((a, b) => a + b, 0) / outcomes.length,
    }));
    const worstEmotion = emotionAvg.sort((a, b) => a.avgOutcome - b.avgOutcome)[0];
    if (worstEmotion && worstEmotion.avgOutcome < 5) {
      topBiases.push({
        name: "Emotional Bias",
        description: `Your worst decisions happen when you feel ${worstEmotion.emotion.toLowerCase()} — avg outcome only ${worstEmotion.avgOutcome.toFixed(1)}/10`,
        examples: withGap
          .filter((d) => d.emotionalState === worstEmotion.emotion)
          .slice(0, 3)
          .map((d) => ({ title: d.title, confidence: d.confidence, outcome: d.outcome })),
      });
    }

    res.status(200).json({
      success: true,
      message: "Bias report fetched successfully",
      data: { unlocked: true, reviewedCount, topBiases },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCategoryBreakdown = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.userId;

    const decisions = await prisma.decision.findMany({
      where: { userId, review: { isNot: null } },
      include: { review: true },
    });

    const categoryMap: Record<string, { confidence: number[]; outcome: number[] }> = {};

    decisions.forEach((d) => {
      if (!categoryMap[d.category]) {
        categoryMap[d.category] = { confidence: [], outcome: [] };
      }
      categoryMap[d.category]!.confidence.push(d.confidencelvl);
      categoryMap[d.category]!.outcome.push(d.review!.outcome);
    });

    const categories = Object.entries(categoryMap).map(([name, data]) => {
      const avgConfidence =
        data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length;
      const avgOutcome =
        data.outcome.reduce((a, b) => a + b, 0) / data.outcome.length;
      return {
        name,
        avgConfidence: parseFloat(avgConfidence.toFixed(2)),
        avgOutcome: parseFloat(avgOutcome.toFixed(2)),
        gap: parseFloat((avgConfidence - avgOutcome).toFixed(2)),
      };
    });

    res.status(200).json({
      success: true,
      message: "Category breakdown fetched successfully",
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEmotionBreakdown = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.userId;

    const decisions = await prisma.decision.findMany({
      where: { userId, review: { isNot: null } },
      include: { review: true },
    });

    const emotionMap: Record<string, number[]> = {};

    decisions.forEach((d) => {
      if (!emotionMap[d.emotionalState]) emotionMap[d.emotionalState] = [];
      emotionMap[d.emotionalState]!.push(d.review!.outcome);
    });

    const emotions = Object.entries(emotionMap).map(([state, outcomes]) => ({
      state,
      avgOutcome: parseFloat(
        (outcomes.reduce((a, b) => a + b, 0) / outcomes.length).toFixed(2)
      ),
      count: outcomes.length,
    }));

    res.status(200).json({
      success: true,
      message: "Emotion breakdown fetched successfully",
      data: { emotions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

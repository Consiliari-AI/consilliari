import prisma from "../lib/prisma.js";

export const createOrUpdateResumeAnalysis = async (userId, analysis) => {
  const resumeAnalysis = await prisma.resumeAnalysis.upsert({
    where: { user_id: userId },
    update: {
      analysis: analysis,
    },
    create: {
      user_id: userId,
      analysis: analysis,
    },
  });

  return resumeAnalysis;
};

export const getResumeAnalysis = async (userId) => {
  const resumeAnalysis = await prisma.resumeAnalysis.findUnique({
    where: { user_id: userId },
  });

  return resumeAnalysis;
};

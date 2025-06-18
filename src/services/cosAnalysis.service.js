import prisma from "../lib/prisma.js";

export const createOrUpdateCOSAnalysis = async (userId, analysis) => {
  const cosAnalysis = await prisma.cOSAnalysis.upsert({
    where: { user_id: userId },
    update: {
      analysis: analysis,
    },
    create: {
      user_id: userId,
      analysis: analysis,
    },
  });

  return cosAnalysis;
};

export const getCOSAnalysis = async (userId) => {
  const cosAnalysis = await prisma.cOSAnalysis.findUnique({
    where: { user_id: userId },
  });

  return cosAnalysis;
};

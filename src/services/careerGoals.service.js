import prisma from "../lib/prisma.js";

export const createOrUpdateCareerGoals = async (userId, goalsArray) => {
  await prisma.careerGoals.deleteMany({
    where: { user_id: userId },
  });

  const goalsData = goalsArray.map(goal => ({
    user_id: userId,
    goal_heading: goal.goal_heading,
    goal_description: goal.goal_description,
    goal_progress: goal.goal_progress,
    goal_completion_status: goal.goal_completion_status,
    goal_deadline: goal.goal_deadline ? new Date(goal.goal_deadline) : null,
    milestones: goal.milestones,
  }));

  const createdGoals = await prisma.careerGoals.createMany({
    data: goalsData,
  });

  return createdGoals;
};

export const getCareerGoals = async (userId) => {
  const careerGoals = await prisma.careerGoals.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' },
  });

  return careerGoals;
}; 
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

export const updateMilestoneAndGoalProgress = async (userId, goalId, milestoneId, completionStatus) => {
  // Get the current goal
  const goal = await prisma.careerGoals.findFirst({
    where: { 
      id: goalId,
      user_id: userId 
    },
  });

  if (!goal) {
    return null;
  }

  // Parse milestones
  const milestones = goal.milestones;
  
  // Find and update the specific milestone
  const milestoneIndex = milestones.findIndex(m => m.milestone_id === milestoneId);
  if (milestoneIndex === -1) {
    return null;
  }

  // Update the milestone completion status
  milestones[milestoneIndex].milestone_completion_status = completionStatus;

  // Calculate new goal progress
  const completedMilestones = milestones.filter(m => m.milestone_completion_status === true).length;
  const totalMilestones = milestones.length;
  const newProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Check if goal is completed (all milestones completed)
  const goalCompletionStatus = completedMilestones === totalMilestones;

  // Update the goal in database
  const updatedGoal = await prisma.careerGoals.update({
    where: { id: goalId },
    data: {
      milestones: milestones,
      goal_progress: newProgress.toString(),
      goal_completion_status: goalCompletionStatus,
    },
  });

  return updatedGoal;
}; 
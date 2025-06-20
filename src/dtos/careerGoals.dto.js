export const careerGoalsDto = (data) => {
  // If data is an array of database rows (from getCareerGoals)
  if (Array.isArray(data) && data.length > 0 && data[0].id) {
    return {
      career_goals: data.map((goal) => ({
        id: goal.id,
        goal_heading: goal.goal_heading || "",
        goal_description: goal.goal_description || "",
        goal_progress: goal.goal_progress || "0",
        goal_completion_status: goal.goal_completion_status || false,
        goal_deadline: goal.goal_deadline || null,
        milestones: goal.milestones || [],
      })),
    };
  }

  // If data is the parsed LLM response (array of goals)
  return {
    career_goals: data.map((goal) => ({
      id: goal.id,
      goal_heading: goal.goal_heading || "",
      goal_description: goal.goal_description || "",
      goal_progress: goal.goal_progress || "0",
      goal_completion_status: goal.goal_completion_status || false,
      goal_deadline: goal.goal_deadline || null,
      milestones: (goal.milestones || []).map((milestone) => ({
        milestone_id: milestone.milestone_id || 0,
        milestone_description: milestone.milestone_description || "",
        milestone_completion_status: milestone.milestone_completion_status || false,
      })),
    })),
  };
};

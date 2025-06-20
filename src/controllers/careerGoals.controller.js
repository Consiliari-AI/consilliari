import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { getUserSettings } from "../services/user.settings.service.js";
import { createOrUpdateCareerGoals, getCareerGoals, updateMilestoneAndGoalProgress } from "../services/careerGoals.service.js";
import { careerGoalsPrompt } from "../llmPrompts/careerGoalsPrompt.js";
import { getLLMResponse } from "../lib/llmConfig.js";
import { careerGoalsDto } from "../dtos/careerGoals.dto.js";

export const generateCareerGoals = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userSettings = await getUserSettings(userId);

  if (!userSettings.resume_content) {
    return next(createError(400, "No resume content found in user settings"));
  }

  if (!userSettings.career_blueprint) {
    return next(createError(400, "No career blueprint found in user settings"));
  }

  const goalsInfo = JSON.parse(userSettings.career_blueprint).goals;
  const systemPrompt = careerGoalsPrompt(userSettings.resume_content, goalsInfo);
  const goalsResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedGoals = JSON.parse(goalsResult);
  await createOrUpdateCareerGoals(userId, parsedGoals);

  res.status(201).json({
    success: true,
    data: careerGoalsDto(parsedGoals),
  });
});

export const getCareerGoalsData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // First try to get existing goals from database
  const careerGoals = await getCareerGoals(userId);

  if (careerGoals && careerGoals.length > 0) {
    return res.status(200).json({
      success: true,
      data: careerGoalsDto(careerGoals),
    });
  }

  // If goals not found, generate them
  const userSettings = await getUserSettings(userId);
  if (!userSettings.resume_content) {
    return next(createError(400, "No resume content found in user settings"));
  }

  if (!userSettings.career_blueprint) {
    return next(createError(400, "No career blueprint found in user settings"));
  }

  const goalsInfo = JSON.parse(userSettings.career_blueprint).goals;
  const systemPrompt = careerGoalsPrompt(userSettings.resume_content, goalsInfo);
  const goalsResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedGoals = JSON.parse(goalsResult);
  await createOrUpdateCareerGoals(userId, parsedGoals);

  res.status(200).json({
    success: true,
    data: careerGoalsDto(parsedGoals),
  });
});

export const updateMilestoneStatus = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { goalId, milestoneId } = req.params;
  const { completion_status } = req.body;

  if (typeof completion_status !== "boolean") {
    return next(createError(400, "completion_status must be a boolean value"));
  }

  try {
    const updatedGoal = await updateMilestoneAndGoalProgress(userId, goalId, parseInt(milestoneId), completion_status);

    if (!updatedGoal) {
      return next(createError(404, "Goal or milestone not found"));
    }

    console.log("updated goal", updatedGoal);
    res.status(200).json({
      success: true,
      message: "Milestone status updated successfully",
      data: careerGoalsDto([updatedGoal]).career_goals[0],
    });
  } catch (error) {
    console.error("Milestone update error:", error);
    return next(createError(500, "Failed to update milestone status"));
  }
});

import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { getUserSettings } from "../services/user.settings.service.js";
import { cosPrompt } from "../llmPrompts/cosPrompt.js";
import { getLLMResponse } from "../lib/llmConfig.js";

export const calculateCOS = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userSettings = await getUserSettings(userId);

  if (!userSettings.resume_content || !userSettings.resume || !userSettings.career_blueprint) {
    return next(createError(400, "Required data not found in user settings"));
  }
  console.log("hello", userSettings);
  const resumeData = JSON.parse(userSettings.resume);
  const careerBlueprintData = JSON.parse(userSettings.career_blueprint);
  const systemPrompt = cosPrompt(userSettings.resume_content, resumeData, careerBlueprintData);
  console.log("hello2w");
  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedCOSAnalysis = JSON.parse(analysisResult);

  res.status(200).json({
    success: true,
    data: parsedCOSAnalysis,
    prompt: systemPrompt,
  });
});

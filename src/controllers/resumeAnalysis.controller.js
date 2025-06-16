import { createError } from "../utils/createError.js";
import { getUserSettings } from "../services/user.settings.service.js";
import { resumeAnalysisPrompt } from "../llmPrompts/resumeAnalysisPrompt.js";
import { getLLMResponse } from "../lib/llmConfig.js";
import { catchAsync } from "../utils/error.js";

export const getResumeAnalysis = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userSettings = await getUserSettings(userId);

  if (!userSettings.resume_content) {
    return next(createError(400, "No resume content found in user settings"));
  }
  const systemPrompt = resumeAnalysisPrompt(userSettings.resume_content);

  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedResumeAnalysis = JSON.parse(analysisResult);
  res.status(200).json({
    success: true,
    data: parsedResumeAnalysis,
  });
});

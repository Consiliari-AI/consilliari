import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { getUserSettings } from "../services/user.settings.service.js";
import { createOrUpdateResumeAnalysis, getResumeAnalysis } from "../services/resumeAnalysis.service.js";
import { resumeAnalysisPrompt } from "../llmPrompts/resumeAnalysisPrompt.js";
import { getLLMResponse } from "../lib/llmConfig.js";
import { resumeAnalysisDto } from "../dtos/resumeAnalysis.dto.js";

export const generateResumeAnalysis = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userSettings = await getUserSettings(userId);
  if (!userSettings.resume_content) {
    return next(createError(400, "No resume content found in user settings"));
  }

  const systemPrompt = resumeAnalysisPrompt(userSettings.resume_content);
  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedAnalysis = JSON.parse(analysisResult);
  await createOrUpdateResumeAnalysis(userId, parsedAnalysis);

  res.status(201).json({
    success: true,
    data: resumeAnalysisDto(parsedAnalysis),
  });
});

export const getResumeAnalysisData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  // First try to get existing analysis from database
  const resumeAnalysis = await getResumeAnalysis(userId);
  
  if (resumeAnalysis) {
    return res.status(200).json({
      success: true,
      data: resumeAnalysisDto(resumeAnalysis.analysis),
    });
  }

  // If analysis not found, generate it
  const userSettings = await getUserSettings(userId);
  if (!userSettings.resume_content) {
    return next(createError(400, "No resume content found in user settings"));
  }

  const systemPrompt = resumeAnalysisPrompt(userSettings.resume_content);
  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedAnalysis = JSON.parse(analysisResult);
  await createOrUpdateResumeAnalysis(userId, parsedAnalysis);

  res.status(200).json({
    success: true,
    data: resumeAnalysisDto(parsedAnalysis),
  });
});

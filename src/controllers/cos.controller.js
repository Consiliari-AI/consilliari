import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { getUserSettings } from "../services/user.settings.service.js";
import { createOrUpdateCOSAnalysis, getCOSAnalysis } from "../services/cosAnalysis.service.js";
import { cosPrompt } from "../llmPrompts/cosPrompt.js";
import { getLLMResponse } from "../lib/llmConfig.js";
import { cosAnalysisDto } from "../dtos/cosAnalysis.dto.js";

export const generateCOS = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userSettings = await getUserSettings(userId);
  if (!userSettings.resume_content || !userSettings.resume || !userSettings.career_blueprint) {
    return next(createError(400, "Required data not found in user settings"));
  }

  const resumeData = JSON.parse(userSettings.resume);
  const careerBlueprintData = JSON.parse(userSettings.career_blueprint);
  const systemPrompt = cosPrompt(userSettings.resume_content, resumeData, careerBlueprintData);
  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedCOSAnalysis = JSON.parse(analysisResult);
  await createOrUpdateCOSAnalysis(userId, parsedCOSAnalysis);

  res.status(201).json({
    success: true,
    data: cosAnalysisDto(parsedCOSAnalysis),
  });
});

export const getCOSAnalysisData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // First try to get existing analysis from database
  const cosAnalysis = await getCOSAnalysis(userId);
  if (cosAnalysis) {
    return res.status(200).json({
      success: true,
      data: cosAnalysisDto(cosAnalysis.analysis),
    });
  }

  // If analysis not found, generate it
  const userSettings = await getUserSettings(userId);
  if (!userSettings.resume_content || !userSettings.resume || !userSettings.career_blueprint) {
    return next(createError(400, "Required data not found in user settings"));
  }

  const resumeData = JSON.parse(userSettings.resume);
  const careerBlueprintData = JSON.parse(userSettings.career_blueprint);
  const systemPrompt = cosPrompt(userSettings.resume_content, resumeData, careerBlueprintData);
  const analysisResult = await getLLMResponse({ systemPrompt, messages: [] });
  const parsedCOSAnalysis = JSON.parse(analysisResult);
  await createOrUpdateCOSAnalysis(userId, parsedCOSAnalysis);

  res.status(200).json({
    success: true,
    data: cosAnalysisDto(parsedCOSAnalysis),
  });
});

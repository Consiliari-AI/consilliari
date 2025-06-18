import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import pdfParse from "pdf-parse";
import { getLLMResponse } from "../lib/llmConfig.js";
import { cvParsingLLMPrompt } from "../lib/cvParsingLLMPrompt.js";
import { updateUserSettings } from "../services/user.settings.service.js";
import { updateUserProfile } from "../services/auth.service.js";
import { cvparseDto } from "../dtos/cvparse.dto.js";
import { resumeAnalysisPrompt } from "../llmPrompts/resumeAnalysisPrompt.js";
import { createOrUpdateResumeAnalysis } from "../services/resumeAnalysis.service.js";

export const parseCV = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(createError(400, "No file uploaded"));
  }
  const dataBuffer = req.file.buffer;

  const parsed = await pdfParse(dataBuffer);
  const cvText = parsed.text;
  const systemPrompt = cvParsingLLMPrompt(cvText);
  let llmResponse = await getLLMResponse({
    systemPrompt,
    messages: [],
  });
  const userSettings = await updateUserSettings(req.user.id, { resume_content: cvText, resume: llmResponse });
  res.status(200).json({
    success: true,
    message: "CV parsed successfully",
    data: cvparseDto(userSettings),
  });

  // Generate resume analysis in background
  try {
    const resumeAnalysisPromptText = resumeAnalysisPrompt(cvText);
    const analysisResult = await getLLMResponse({ systemPrompt: resumeAnalysisPromptText, messages: [] });
    const parsedAnalysis = JSON.parse(analysisResult);
    await createOrUpdateResumeAnalysis(req.user.id, parsedAnalysis);
  } catch (error) {
    console.error("Background resume analysis generation failed:", error);
  }
});

export const completeOnboarding = catchAsync(async (req, res) => {
  const { resume, career_blueprint } = req.body;
  await updateUserSettings(req.user.id, {
    resume: JSON.stringify(resume),
    career_blueprint: JSON.stringify(career_blueprint),
  });

  await updateUserProfile(req.user.id, {
    is_onboarding_completed: true,
  });

  res.status(200).json({
    success: true,
    message: "Onboarding completed successfully",
  });
});

import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import pdfParse from "pdf-parse";
import { getLLMResponse } from "../lib/llmConfig.js";
import { cvParsingLLMPrompt } from "../lib/cvParsingLLMPrompt.js";
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
  console.log("cv text is", llmResponse);

  res.status(200).json({
    success: true,
    message: "CV parsed successfully",
    data: JSON.parse(llmResponse),
  });
});

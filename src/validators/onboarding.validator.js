import { z } from "zod";
import { resumeSchema } from "./resume.validator.js";
import { careerBlueprintSchema } from "./careerBlueprint.validator.js";

export const onboardingSchema = z.object({
  resume: resumeSchema,
  career_blueprint: careerBlueprintSchema,
});

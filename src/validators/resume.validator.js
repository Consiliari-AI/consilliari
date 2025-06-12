import { z } from "zod";
import {
  currentRoleExperienceOptions,
  educationLevelOptions,
  employmentType,
  industryOptions,
  promotionBeforeThatOptions,
  relevanceOfEducationOptions,
  time_in_years,
  proficiencyLevelOptions,
} from "../constants/onboardingData.js";

const jobInformationSchema = z.object({
  current_job_title: z
    .string({
      required_error: "Current job title is required",
      invalid_type_error: "Current job title must be a string",
    })
    .min(1, "Current job title cannot be empty")
    .max(200, "Current job title is too long"),

  current_company: z
    .string({
      required_error: "Current company is required",
      invalid_type_error: "Current company must be a string",
    })
    .min(1, "Current company cannot be empty")
    .max(200, "Current company name is too long"),

  industry: z.enum(industryOptions, {
    required_error: "industry is required",
    invalid_type_error: "Please select a valid industry",
  }),

  time_in_current_role: z.enum(time_in_years, {
    required_error: "Time in current role is required",
    invalid_type_error: "Please select a valid time_in_current_role",
  }),

  employment_type: z.enum(employmentType, {
    required_error: "Employment type is required",
    invalid_type_error: "Please select a valid employment type",
  }),

  location: z
    .string({
      required_error: "Location is required",
      invalid_type_error: "Location must be a string",
    })
    .min(1, "Location cannot be empty")
    .max(200, "Location is too long"),

  total_years_of_experience: z.coerce
    .number({
      required_error: "Total years of experience is required",
      invalid_type_error: "Total years of experience must be a number",
    })
    .min(0.1, { message: "Experience cannot be 0 or negative" }),

  promotion_before_that: z.enum(promotionBeforeThatOptions, {
    required_error: "promotion_before_that is required",
    invalid_type_error: "Please select a valid promotion_before_that",
  }),

  last_promotion_time: z
    .string({
      required_error: "Last promotion date is required",
      invalid_type_error: "Last promotion date must be a string",
    })
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date (e.g., '2024-05-01')"),
});

const certificateSchema = z.object({
  name: z
    .string({
      required_error: "Certificate name is required",
      invalid_type_error: "Certificate name must be a string",
    })
    .min(1, "Certificate name cannot be empty")
    .max(100, "Certificate name is too long"),

  isActive: z.boolean({
    required_error: "Active status is required",
    invalid_type_error: "isActive must be a boolean",
  }),
});

const studyInformationSchema = z.object({
  highest_level_of_education: z.enum(educationLevelOptions, {
    required_error: "Education level is required",
    invalid_type_error: "Please select a valid education level",
  }),
  field_of_study: z
    .string({
      required_error: "Field of study is required",
      invalid_type_error: "Field of study must be a string",
    })
    .min(1, "Field of study cannot be empty")
    .max(100, "Field of study is too long"),

  institute_name: z
    .string({
      required_error: "Institute name is required",
      invalid_type_error: "Institute name must be a string",
    })
    .min(1, "Institute name cannot be empty")
    .max(100, "Institute name is too long"),

  relevance_of_education: z.enum(relevanceOfEducationOptions, {
    required_error: "Relevance is required",
    invalid_type_error: "Please select a valid relevance level",
  }),
  certificates_list: z.array(certificateSchema).min(0, "Certificates list cannot be negative"),
});

const skillsInformationSchema = z.object({
  top_skills: z
    .array(
      z.object({
        name: z
          .string({
            required_error: "Skill name is required",
            invalid_type_error: "Skill name must be a string",
          })
          .min(1, "Skill name cannot be empty")
          .max(100, "Skill name is too long"),

        proficiency: z.enum(proficiencyLevelOptions, {
          required_error: "Proficiency level is required",
          invalid_type_error: "Invalid proficiency level",
        }),
      })
    )
    .min(1, "At least one skill is required")
    .max(10, "Maximum 10 skills allowed"),

  achievements: z
    .string({
      required_error: "Achievement is required",
      invalid_type_error: "Achievement must be a string",
    })
    .min(1, "Achievement cannot be empty")
    .max(1000, "Achievement description is too long"),

  performance_recognition: z
    .string({
      required_error: "Performance recognition is required",
      invalid_type_error: "Performance recognition must be a string",
    })
    .min(1, "Performance recognition cannot be empty")
    .max(1000, "Performance recognition is too long"),

  current_role_experience: z.enum(currentRoleExperienceOptions, {
    required_error: "Current role experience is required",
    invalid_type_error: "Invalid role experience selection",
  }),
});

// Export the main resume schema
export const resumeSchema = z.object({
  job_information: jobInformationSchema,
  study_information: studyInformationSchema,
  skills_information: skillsInformationSchema,
});

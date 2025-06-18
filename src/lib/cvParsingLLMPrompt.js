import { emptyResumeState } from "../constants/emptyOnboardingState.js";
import {
  time_in_years,
  industryOptions,
  employmentType,
  promotionBeforeThatOptions,
  educationLevelOptions,
  relevanceOfEducationOptions,
  proficiencyLevelOptions,
  currentRoleExperienceOptions,
} from "../constants/onboardingData.js";
export const cvParsingLLMPrompt = (cvText) => {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  return `
    Please analyze the following CV/resume text and extract relevant information in a structured format. 

    Today's date is ${dateString}
    Use this date to calculate experience durations where needed.
    If any job start date or end date in the CV only specifies month and year (without a specific day),
    always assume the 1st day of that month.

    Here's the CV text:
    ${cvText}

    Please structure the response exactly in this format:
    ${JSON.stringify(emptyResumeState)}

    Some fields accept only pre-defined enum values. Use **only these values exactly as provided**:
    "industry": ${industryOptions}
    "time_in_current_role":${time_in_years}
    "employment_type":${employmentType}
    "promotion_before_that":${promotionBeforeThatOptions}
    "highest_level_of_education":${educationLevelOptions}
    "relevance_of_education":${relevanceOfEducationOptions}
    "proficiency":${proficiencyLevelOptions}
    "current_role_experience":${currentRoleExperienceOptions}

    ## Parsing Guidelines:
    1. Extract data only if explicitly mentioned in the CV. Do not infer or guess missing information.

    2. For the field top_skills, provide an array of up to 7 skill objects. Each object must include both:
         name (the skill name)
         proficiency (choose any one from the proficiency enum list)
       You must not return more than 7 skills, and for each skill, ensure you include a proficiency
       value that reflects your best judgment based on the user's resume.

    3. For the field certificates_list, provide an array of objects where each object has a
       name (certificate name) and isActive(boolean) field.

    4. For the field total_years_of_experience, Calculate the total professional experience by summing
       the durations of all listed roles. Use start and end dates of roles to compute durations in years (decimal values allowed, e.g., 0.5 for 6 months).
       If an end date is set as "Present" or if it is missing, use today's date (${dateString}) as the end date.


    5. For the field time_in_current_role, identify the start date of the candidate's most recent job.
       Calculate the exact number of months between start date and today ${dateString}. 
       Map the duration to the closest enum value in ${time_in_years} (e.g., "7-12 months", "1-2 years","2-3 years").
       For example, if start date of candidate's current job is April 2024 and 
       today's date is May 2025, the duration is exactly 13 months. Based on this calculation,
       select the correct value from the provided time_in_current_role enums (e.g "1-2 years").
       If the duration is exactly at a boundary (e.g., exactly 12 months), select the higher 
       appropriate bucket (e.g "1-2 years").
       You must select a value only from the provided enum list ${time_in_years}. Do not generate any value outside this list.
      
    6. For the field promotion_before_that:
       A promotion is defined as either a change in designation within the same company or a job
       switch to a different company on the same role or at a higher role.
       If a promotion is identified, determine the start date of the promoted role.
       Calculate the duration from start date of the promoted role to today ${dateString}
       Map the duration to the closest enum value in ${promotionBeforeThatOptions} (e.g., "1-6 months", "6-12 months", "1-2 years").
       You must select a value only from the provided enum list ${time_in_years}. Do not generate any value outside this list.

    7. For the field last_promotion_time, it should always follow this format (yyyy-MM-dd)

    7. If a field's information is not found, leave it as an empty string or empty array
   
    ### Important:
    Do not add anything outside the JSON block. Always follow this format strictly.
    Do NOT wrap any of your JSON responses in triple backticks (\`\`\`), do NOT use \`\`\`json, and do NOT include any markdown syntax. 
    `;
};

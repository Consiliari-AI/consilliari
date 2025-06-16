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
  const dateString = today.toString();
  return `
    Please analyze the following CV/resume text and extract relevant information in the following JSON format. 
    Only include fields that you can confidently extract from the text. Leave other fields as empty.
    Here's the CV text:

    Today's date is ${dateString}
    I am providing today's date so you can accurately compute experience durations such as total_years_of_experience
    and time_in_current_role, by comparing past job start dates against today.

    ${cvText}

    Please structure the response exactly like this format:
    ${JSON.stringify(emptyResumeState)}

    Some of the fields you have to fill as an enum. Following are some of the fields enum options:
    "industry": ${industryOptions}
    "time_in_current_role":${time_in_years}
    "employment_type":${employmentType}
    "promotion_before_that":${promotionBeforeThatOptions}
    "highest_level_of_education":${educationLevelOptions}
    "relevance_of_education":${relevanceOfEducationOptions}
    "proficiency":${proficiencyLevelOptions}
    "current_role_experience":${currentRoleExperienceOptions}

    Important guidelines:
    1. Only extract information that is explicitly stated in the CV
    2. For the field top_skills, provide an array of up to 7 skill objects. Each object must include both:
         name (the skill name)
         proficiency (choose any one from the proficiency enum list)
         You must not return more than 7 skills, and for each skill, ensure you include a proficiency value that reflects your best judgment based on the user’s resume.
    3. For the field certificates_list, provide an array of objects where each object has a name (certificate name) and isActive(boolean) field.
    4. For the field total_years_of_experience, infer the user's total professional experience by analyzing all the experiences listed in their CV. You are allowed to return decimal values (e.g., 0.4, 2.5, etc.), but the value must be expressed in years.
    3. If a field's information is not found, leave it as an empty string or empty array
    4. Do not make assumptions or infer information
    5. Keep the exact same structure as the template
   
    ### Important:
    Do not add anything outside the JSON block. Always follow this format strictly.
    Do NOT wrap any of your JSON responses in triple backticks (\`\`\`), do NOT use \`\`\`json, and do NOT include any markdown syntax. 
    `;
};

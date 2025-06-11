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
  return `
    Please analyze the following CV/resume text and extract relevant information in the following JSON format. 
    Only include fields that you can confidently extract from the text. Leave other fields as empty.
    Here's the CV text:

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
    2. For array of top_skills, it is an array of objects where each object has a name and proficiency field
    3. For array of certificates_list, it is an array of objects where each object has a name and isActive(boolean) field
    3. If a field's information is not found, leave it as an empty string or empty array
    4. Do not make assumptions or infer information
    5. Keep the exact same structure as the template
   
    ### Important:
    Do not add anything outside the JSON block. Always follow this format strictly.
    Do NOT wrap any of your JSON responses in triple backticks (\`\`\`), do NOT use \`\`\`json, and do NOT include any markdown syntax. 
    `;
};

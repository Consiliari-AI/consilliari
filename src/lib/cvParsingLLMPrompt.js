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
    and time_in_current_role, by comparing job start dates against today. You must calculate exact
    differences between dates using full calendar months and years, and always round to the higher
    bucket when the value falls exactly on a boundary.

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
    5. For the field time_in_current_role, infer the user's professional experience in their present
       company. Use the role start date from the CV and compare it with today's date that I provided
       you. Calculate the difference in complete months and years. For example, if start date of role in cv is
       April 2024 and today's date is May 2025, the duration is exactly 13 months. Based on this calculation,
       select the correct value from the provided time_in_current_role enums. Do not estimate or approximate — calculate precisely based on calendar months.
       If the difference is exactly at a boundary (e.g., exactly 12 months), select the higher appropriate bucket (for example: 7-12 months → 1-2 years).
    6. If a field's information is not found, leave it as an empty string or empty array
    7. Do not make assumptions or infer information
    8. Keep the exact same structure as the template
   
    ### Important:
    Do not add anything outside the JSON block. Always follow this format strictly.
    Do NOT wrap any of your JSON responses in triple backticks (\`\`\`), do NOT use \`\`\`json, and do NOT include any markdown syntax. 
    `;
};

export const cosPrompt = (resumeText, resumeData, careerBluePrintData) => {
  const dataSources = {
    careerCapital: {
      current_job_title: resumeData?.job_information?.current_job_title,
      total_experience: resumeData?.job_information?.total_years_of_experience,
      time_in_current_role: resumeData?.job_information?.time_in_current_role,
      highest_education: resumeData?.study_information?.highest_level_of_education,
      education_relevance: resumeData?.study_information?.relevance_of_education,
      certifications: resumeData?.study_information?.certificates_list || [],
    },
    skillsAndReadiness: {
      top_skills: resumeData?.skills_information?.top_skills || [],
      learning_agility: careerBluePrintData?.momentum?.learning_agility,
      challenges_for_goals: careerBluePrintData?.goals?.challenges_for_goals,
      readiness_for_next_goal: careerBluePrintData?.goals?.readiness_for_next_goal,
      development_for_next_role: careerBluePrintData?.goals?.development_for_next_role,
    },
    performanceAndImpact: {
      achievements: resumeData?.skills_information?.achievements,
      performance_recognition: resumeData?.skills_information?.performance_recognition,
    },
    growthEngine: {
      last_promotion: resumeData?.job_information?.last_promotion_time,
      promotion_before_that: resumeData?.job_information?.promotion_before_that,
      proactive_activities: careerBluePrintData?.momentum?.proactive_career_activities,
      proactive_example: careerBluePrintData?.momentum?.proactive_learning_example,
      industry_growth_perception: careerBluePrintData?.momentum?.industry_growth_trajectory_perception,
    },
    alignmentAndMarket: {
      alignment_rating: careerBluePrintData?.momentum?.personal_alignment_fulfilment?.rating,
      alignment_explanation: careerBluePrintData?.momentum?.personal_alignment_fulfilment?.explaination,
      motivation_methods: careerBluePrintData?.work_style?.accountability_methods,
      compensation_growth: careerBluePrintData?.market_view?.compensation_growth_trajectory,
      seniority_perception: careerBluePrintData?.momentum?.seniority_perception?.explaination,
      current_salary: careerBluePrintData?.market_view?.annual_salary,
    },
  };

  const prompt = `
You are a professional COS (Career Optimization Score) evaluator.

Your task is to calculate a user’s **Career Optimization Score (COS)** out of 100 using five weighted categories.

### COS Scoring Formula:
The final COS is calculated using a weighted average of five category scores:

- Career Capital: 20%
- Skills & Readiness: 25%
- Performance & Impact: 20%
- Growth Engine: 20%
- Alignment & Market Positioning: 15%

**Formula:**  
\`(career_capital * 0.20) + (skills_and_readiness * 0.25) + (performance_and_impact * 0.20) + (growth_engine * 0.20) + (alignment_and_market * 0.15)\`
Always use this formula properly to calculate the final COS score and make calculation such as
multiplications and additions right and accurate.

---

### Output Format:
Return **ONLY valid JSON** (no markdown). Follow this **exact structure**:

{
  "total_cos_score": number (final result using the formula),
  "rating_label": "Poor | Fair | Moderately Optimized | Well Optimized | Highly Optimized",
  "score_breakdown": {
    "career_capital": number (0-100),
    "skills_and_readiness": number (0-100),
    "performance_and_impact": number (0-100),
    "growth_engine": number (0-100),
    "alignment_and_market": number (0-100)
  }
}

---

### Rating Label Rules:
- 0-39 → "Poor"
- 40-54 → "Fair"
- 55-69 → "Moderately Optimized"
- 70-84 → "Well Optimized"
- 85-100 → "Highly Optimized"

---

### User Resume:
${resumeText}

#### Career Capital:
${JSON.stringify(dataSources.careerCapital, null, 2)}

#### Skills & Readiness:
${JSON.stringify(dataSources.skillsAndReadiness, null, 2)}

#### Performance & Impact:
${JSON.stringify(dataSources.performanceAndImpact, null, 2)}

#### Growth Engine:
${JSON.stringify(dataSources.growthEngine, null, 2)}

#### Alignment & Market Positioning:
${JSON.stringify(dataSources.alignmentAndMarket, null, 2)}

### IMPORTANT RULES:
 Do not add anything outside the JSON block. Always follow this format strictly.
 Do NOT wrap any of your JSON responses in triple backticks (\`\`\`), do NOT use \`\`\`json, and do NOT include any markdown syntax. 
`;

  return prompt;
};

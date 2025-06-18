export const resumeAnalysisDto = (data) => {
  return {
    resume_analysis: {
      strengths: data.resume_analysis?.strengths || [],
      weaknesses: data.resume_analysis?.weaknesses || [],
      keyword_analysis: {
        suggestions: data.keyword_analysis?.suggestions || "",
        missing_keywords: data.keyword_analysis?.missing_keywords || [],
      },
      achievement_focus: data.achievement_focus || 0,
      ats_compatibility: data.ats_compatibility || 0,
      keyword_optimization: data.keyword_optimization || 0,
      overall_resume_score: data.overall_resume_score || "0%",
      resume_strength_tips: {
        negative: data.resume_strength_tips?.negative || "",
        positive: data.resume_strength_tips?.positive || "",
      },
    },
  };
};
